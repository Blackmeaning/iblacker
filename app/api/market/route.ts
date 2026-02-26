import { NextResponse } from "next/server";
import { getStockPrice, getStockProfile, getCryptoPrice } from "@/lib/market/providers";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const symbol = searchParams.get("symbol");

  if (!type || !symbol) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  try {
    if (type === "stock") {
      const [price, profile] = await Promise.all([
        getStockPrice(symbol),
        // if FMP fails, we still want price
        getStockProfile(symbol).catch(() => null),
      ]);

      return NextResponse.json({ ok: true, price, profile });
    }

    if (type === "crypto") {
      const data = await getCryptoPrice(symbol);
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "provider_error";
    return NextResponse.json({ error: "provider_error", detail: msg }, { status: 500 });
  }
}
