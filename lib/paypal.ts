import crypto from "crypto";

type Json = Record<string, unknown>;

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export type PayPalConfig = {
  apiBase: string;
  clientId: string;
  clientSecret: string;
  webhookId: string;
  proPlanId: string;
  elitePlanId: string;
};

/**
 * Lazy config getter (SAFE for Next build)
 * Do NOT call at module scope in route files.
 */
export function getPayPalConfig(): PayPalConfig {
  return {
    apiBase: mustEnv("PAYPAL_API_BASE"),
    clientId: mustEnv("Ac8MbYi-npYXTBWmvUH5OAThBvlRwynbULb5xwdqIFdEUlcLPbKoVrktstUrjAr8Mkls-LnqcGV5SsNp"),
    clientSecret: mustEnv("ELKZqwqpkWZEi6TeUoq4zBDVOs3DfxwUHyD_JB9CdNXol0A-fYx4xQI6mcSAtZ5tY2VbI7C3SVWmeMg_"),
    webhookId: mustEnv("41F48701P41445410"),
    proPlanId: mustEnv("P-0TP08853AV6605124NGROAEQ"),
    elitePlanId: mustEnv("P-52C61852CU667074HNGROAUY"),
  };
}

let cachedToken: { token: string; expMs: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const cfg = getPayPalConfig();

  const now = Date.now();
  if (cachedToken && cachedToken.expMs > now + 30_000) return cachedToken.token;

  const basic = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");

  const res = await fetch(`${cfg.apiBase}/v1/oauth2/token`, {
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
  const cfg = getPayPalConfig();
  const token = await getPayPalAccessToken();

  const res = await fetch(`${cfg.apiBase}${path}`, {
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

/**
 * Verify PayPal webhook signature (server-to-server)
 */
export async function verifyPayPalWebhook(rawBody: string, headers: Headers): Promise<boolean> {
  const cfg = getPayPalConfig();

  const transmissionId = headers.get("paypal-transmission-id") ?? "";
  const transmissionTime = headers.get("paypal-transmission-time") ?? "";
  const certUrl = headers.get("paypal-cert-url") ?? "";
  const authAlgo = headers.get("paypal-auth-algo") ?? "";
  const transmissionSig = headers.get("paypal-transmission-sig") ?? "";

  // If any header missing, verification fails
  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) return false;

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return false;
  }

  try {
    const payload = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: cfg.webhookId,
      webhook_event: event,
    };

    const out = await paypalFetch<{ verification_status?: string }>(
      "/v1/notifications/verify-webhook-signature",
      { method: "POST", body: JSON.stringify(payload) }
    );

    return out.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}

/**
 * deterministic idempotency key (32 chars)
 */
export function idempotencyKey(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}