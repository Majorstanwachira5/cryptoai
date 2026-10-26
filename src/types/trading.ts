export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop_limit";
export type OrderStatus = "open" | "filled" | "partially_filled" | "cancelled" | "rejected";

export interface PaperOrder {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  triggerPrice?: number;
  amount: number;
  filledAmount: number;
  remainingAmount: number;
  status: OrderStatus;
  fee: number;
  feeAsset: string;
  totalCost: number;
  createdAt: number;
  updatedAt: number;
}

export interface Position {
  symbol: string;
  baseAsset: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  totalCost: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface TradeHistoryItem {
  id: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  price: number;
  amount: number;
  fee: number;
  total: number;
  timestamp: number;
}
