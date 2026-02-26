function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) throw new Error(`missing_env_${name}`);
  return v;
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`http_${res.status}_${text}`);
  return json;
}

// ---------- STOCK PRICE (Polygon) ----------
export async function getStockPrice(symbol: string) {
  const key = mustEnv("POLYGON_API_KEY");
  const url = `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(
    symbol
  )}/prev?apiKey=${encodeURIComponent(key)}`;

  const data = (await getJson(url)) as {
    results?: Array<Record<string, unknown>>;
  };

  return data.results?.[0] ?? null;
}

// ---------- CRYPTO PRICE (CoinGecko, no key) ----------
export async function getCryptoPrice(id: string) {
  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${encodeURIComponent(id)}` +
    `&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

  const data = (await getJson(url)) as Record<string, unknown>;
  const out = data[id];
  return typeof out === "object" && out !== null ? out : null;
}
