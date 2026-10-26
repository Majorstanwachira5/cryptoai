import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const state = store.getState();
  return NextResponse.json({
    openOrders: state.openOrders,
    orderHistory: state.orderHistory,
    tradeHistory: state.tradeHistory,
    positions: state.positions,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = store.submitPaperOrder(body);
    return NextResponse.json({
      status: "success",
      order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message || "Order placement failed" },
      { status: 400 }
    );
  }
}
