export type P2POrderSide = "buy" | "sell";

export type P2POrderStatus =
  | "CREATED"
  | "FUNDS_RESERVED"
  | "PAYMENT_PENDING"
  | "PAYMENT_MARKED"
  | "PAYMENT_VERIFIED"
  | "RELEASE_PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "DISPUTED"
  | "REFUNDED";

export interface P2PPaymentMethod {
  id: string;
  type: "bank_transfer" | "revolut" | "wise" | "paypal" | "mpesa";
  name: string;
  details: string;
}

export interface P2POffer {
  id: string;
  advertiserId: string;
  advertiserName: string;
  advertiserRating: number;
  completedOrders: number;
  completionRate: number;
  side: P2POrderSide; // "buy" means advertiser wants to buy USDT, user sells. "sell" means advertiser sells USDT to user
  asset: string; // USDT
  fiatCurrency: string; // USD, EUR, GBP, KES, INR
  pricePerUnit: number;
  availableAmount: number;
  minLimitFiat: number;
  maxLimitFiat: number;
  paymentMethods: string[];
  terms: string;
  isOnline: boolean;
}

export interface P2POrder {
  id: string;
  orderNumber: string;
  offerId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  asset: string;
  cryptoAmount: number;
  fiatCurrency: string;
  fiatAmount: number;
  pricePerUnit: number;
  status: P2POrderStatus;
  paymentMethod: string;
  paymentDetails: string;
  referenceCode: string;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: number;
  }>;
}
