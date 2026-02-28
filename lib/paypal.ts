import crypto from "crypto";

type Json = Record<string, unknown>;

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const paypalEnv = {
  apiBase: mustEnv("PAYPAL_API_BASE"),
  clientId: mustEnv("PAYPAL_CLIENT_ID"),
  clientSecret: mustEnv("PAYPAL_CLIENT_SECRET"),
  webhookId: mustEnv("PAYPAL_WEBHOOK_ID"),
  proPlanId: mustEnv("PAYPAL_PRO_PLAN_ID"),
  elitePlanId: mustEnv("PAYPAL_ELITE_PLAN_ID"),
};

let cachedToken: { token: string; expMs: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expMs > now + 30_000) return cachedToken.token;

  const basic = Buffer.from(`${paypalEnv.clientId}:${paypalEnv.clientSecret}`).toString("base64");

  const res = await fetch(`${paypalEnv.apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PayPal token error (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expMs: now + data.expires_in * 1000 };
  return data.access_token;
}

export async function paypalFetch<T = Json>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalEnv.apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`PayPal API error (${res.status}): ${text}`);

  return text ? (JSON.parse(text) as T) : ({} as T);
}

// Webhook verification
export async function verifyPayPalWebhook(rawBody: string, headers: Headers): Promise<boolean> {
  // PayPal sends these headers for verification:
  const transmissionId = headers.get("paypal-transmission-id") || "";
  const transmissionTime = headers.get("paypal-transmission-time") || "";
  const certUrl = headers.get("paypal-cert-url") || "";
  const authAlgo = headers.get("paypal-auth-algo") || "";
  const transmissionSig = headers.get("paypal-transmission-sig") || "";

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) return FalseSafe();

  // If any header is missing, just fail verification
  function FalseSafe() { return false; }

  try {
    const payload = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: paypalEnv.webhookId,
      webhook_event: JSON.parse(rawBody),
    };

    const out = await paypalFetch<{ verification_status: string }>(
      "/v1/notifications/verify-webhook-signature",
      { method: "POST", body: JSON.stringify(payload) }
    );

    return out.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}

// deterministic idempotency key
export function idempotencyKey(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}
