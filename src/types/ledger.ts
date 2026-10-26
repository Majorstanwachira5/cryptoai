export type TransactionType =
  | "faucet_deposit"
  | "deposit"
  | "withdrawal"
  | "internal_transfer_sent"
  | "internal_transfer_received"
  | "paper_trade_buy"
  | "paper_trade_sell"
  | "paper_trade_fee"
  | "p2p_escrow_locked"
  | "p2p_released"
  | "referral_bonus";

export type TransactionStatus = "completed" | "pending" | "failed" | "cancelled";

export interface LedgerTransaction {
  id: string;
  txHash: string;
  userId: string;
  counterparty?: string;
  asset: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  fee: number;
  balanceAfter: number;
  description: string;
  timestamp: number;
}

export interface AssetBalance {
  asset: string;
  name: string;
  free: number;
  locked: number;
  total: number;
  usdValue: number;
}

export interface InternalTransferRequest {
  recipientIdentifier: string; // Email, UID, or Phone
  asset: string;
  amount: number;
  note?: string;
}
