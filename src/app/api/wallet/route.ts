import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const state = store.getState();
  return NextResponse.json({
    status: "success",
    timestamp: Date.now(),
    balances: state.balances,
    ledger: state.ledger,
  });
}
