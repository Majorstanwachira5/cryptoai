import { NextResponse } from "next/server";
import { getInitialTickers } from "@/lib/marketData";

export async function GET() {
  const tickers = getInitialTickers();
  return NextResponse.json({
    status: "success",
    timestamp: Date.now(),
    data: tickers,
  });
}
