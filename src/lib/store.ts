import { AssetBalance, InternalTransferRequest, LedgerTransaction } from "@/types/ledger";
import { PaperOrder, Position, TradeHistoryItem } from "@/types/trading";
import { P2POffer, P2POrder, P2POrderStatus } from "@/types/p2p";
import { ReferralStats } from "@/types/referral";
import { UserProfile } from "@/types/auth";
import { BacktestResult } from "@/types/backtest";
import { getCurrentPrice, SUPPORTED_PAIRS } from "./marketData";

export interface ExchangeState {
  user: UserProfile;
  balances: Record<string, AssetBalance>;
  ledger: LedgerTransaction[];
  openOrders: PaperOrder[];
  orderHistory: PaperOrder[];
  tradeHistory: TradeHistoryItem[];
  positions: Position[];
  p2pOffers: P2POffer[];
  p2pOrders: P2POrder[];
  referralStats: ReferralStats;
  backtestResults: BacktestResult[];
  adminMetrics: {
    totalVolumeUSDT: number;
    activeUsers: number;
    openDisputes: number;
    totalReserveUSDT: number;
  };
}

const DEFAULT_USER: UserProfile = {
  id: "user_cb_8829",
  uid: "88291045",
  username: "BullTrader_Pro",
  email: "trader@cryptobull.ai",
  role: "admin", // Admin enabled for complete exploration of all panels
  kycTier: "tier2_verified",
  twoFactorEnabled: true,
  antiPhishingCode: "CRYPTOBULL_SECURE_99",
  preferredFiat: "USD",
  timezone: "UTC",
  createdAt: Date.now() - 86400000 * 45,
  securityActivity: [
    {
      id: "sec_1",
      action: "Login with 2FA Authenticator",
      ipAddress: "192.168.1.105",
      location: "Frankfurt, Germany",
      device: "Chrome / Windows 11",
      status: "success",
      timestamp: Date.now() - 1000 * 60 * 15,
    },
    {
      id: "sec_2",
      action: "Internal Transfer Signed",
      ipAddress: "192.168.1.105",
      location: "Frankfurt, Germany",
      device: "Chrome / Windows 11",
      status: "success",
      timestamp: Date.now() - 1000 * 60 * 180,
    },
    {
      id: "sec_3",
      action: "API Key Generated",
      ipAddress: "192.168.1.105",
      location: "Frankfurt, Germany",
      device: "Chrome / Windows 11",
      status: "success",
      timestamp: Date.now() - 1000 * 60 * 60 * 48,
    },
  ],
};

const DEFAULT_BALANCES: Record<string, AssetBalance> = {
  USDT: { asset: "USDT", name: "Tether USD", free: 15420.50, locked: 1250.00, total: 16670.50, usdValue: 16670.50 },
  BTC: { asset: "BTC", name: "Bitcoin", free: 0.3542, locked: 0.05, total: 0.4042, usdValue: 27425.00 },
  ETH: { asset: "ETH", name: "Ethereum", free: 2.1500, locked: 0.00, total: 2.1500, usdValue: 7482.43 },
  SOL: { asset: "SOL", name: "Solana", free: 14.80, locked: 2.00, total: 16.80, usdValue: 3000.48 },
  BNB: { asset: "BNB", name: "BNB", free: 5.20, locked: 0.00, total: 5.20, usdValue: 3080.48 },
};

const DEFAULT_LEDGER: LedgerTransaction[] = [
  {
    id: "tx_init_1",
    txHash: "0x89f41b2c4e99d8134760a9f600d89281a8c9b2d890",
    userId: "user_cb_8829",
    asset: "USDT",
    amount: 10000.00,
    type: "faucet_deposit",
    status: "completed",
    fee: 0,
    balanceAfter: 10000.00,
    description: "Synthetic Paper Trading Initial Faucet Capital",
    timestamp: Date.now() - 86400000 * 7,
  },
  {
    id: "tx_init_2",
    txHash: "0x34a19b88ff91c28054e819b910ca8190d718291081",
    userId: "user_cb_8829",
    counterparty: "UID: 99182301",
    asset: "USDT",
    amount: 1500.00,
    type: "internal_transfer_received",
    status: "completed",
    fee: 0,
    balanceAfter: 11500.00,
    description: "Internal Transfer received from partner trader",
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: "tx_init_3",
    txHash: "0x77e10b18204918204c8109318c0918029381903829",
    userId: "user_cb_8829",
    asset: "USDT",
    amount: 250.00,
    type: "referral_bonus",
    status: "completed",
    fee: 0,
    balanceAfter: 11750.00,
    description: "Tier 2 Referral Commission Settlement",
    timestamp: Date.now() - 86400000 * 1,
  },
];

const DEFAULT_P2P_OFFERS: P2POffer[] = [
  {
    id: "p2p_off_1",
    advertiserId: "adv_apex",
    advertiserName: "ApexLiquidity_Global",
    advertiserRating: 99.4,
    completedOrders: 1840,
    completionRate: 98.9,
    side: "sell", // Selling USDT to user
    asset: "USDT",
    fiatCurrency: "USD",
    pricePerUnit: 1.002,
    availableAmount: 48500.00,
    minLimitFiat: 100.00,
    maxLimitFiat: 10000.00,
    paymentMethods: ["Bank Transfer", "Wise", "Revolut"],
    terms: "Instant release upon receipt. No third party payments allowed.",
    isOnline: true,
  },
  {
    id: "p2p_off_2",
    advertiserId: "adv_swift",
    advertiserName: "SwiftCrypto_OTC",
    advertiserRating: 98.8,
    completedOrders: 924,
    completionRate: 99.1,
    side: "sell",
    asset: "USDT",
    fiatCurrency: "USD",
    pricePerUnit: 1.004,
    availableAmount: 18200.00,
    minLimitFiat: 50.00,
    maxLimitFiat: 5000.00,
    paymentMethods: ["Zelle", "PayPal", "Bank Transfer"],
    terms: "Strictly verified accounts. Quick release 24/7.",
    isOnline: true,
  },
  {
    id: "p2p_off_3",
    advertiserId: "adv_bull",
    advertiserName: "BullMarketMaker",
    advertiserRating: 99.8,
    completedOrders: 3120,
    completionRate: 99.7,
    side: "buy", // Buying USDT from user
    asset: "USDT",
    fiatCurrency: "USD",
    pricePerUnit: 0.998,
    availableAmount: 75000.00,
    minLimitFiat: 200.00,
    maxLimitFiat: 25000.00,
    paymentMethods: ["Bank Transfer", "Wise"],
    terms: "Commercial bank wire fast settlement within 15 minutes.",
    isOnline: true,
  },
  {
    id: "p2p_off_4",
    advertiserId: "adv_euro",
    advertiserName: "EuroBridge_Direct",
    advertiserRating: 99.1,
    completedOrders: 1420,
    completionRate: 98.5,
    side: "sell",
    asset: "USDT",
    fiatCurrency: "EUR",
    pricePerUnit: 0.925,
    availableAmount: 32000.00,
    minLimitFiat: 100.00,
    maxLimitFiat: 8000.00,
    paymentMethods: ["SEPA Instant", "Revolut"],
    terms: "SEPA Instant payments only. Fast release.",
    isOnline: true,
  },
];

const DEFAULT_REFERRAL: ReferralStats = {
  referralCode: "BULL99X",
  referralLink: "https://cryptobull.ai/register?ref=BULL99X",
  totalReferrals: 18,
  eligibleReferrals: 14,
  totalCommissionUSDT: 1420.80,
  pendingCommissionUSDT: 185.40,
  confirmedCommissionUSDT: 1235.40,
  currentTier: {
    tier: 2,
    name: "VIP Gold Affiliate",
    minVolume: 100000,
    commissionRate: 0.25, // 25%
  },
  nextTier: {
    tier: 3,
    name: "Institutional Partner",
    minVolume: 500000,
    commissionRate: 0.35,
  },
  recentReferrals: [
    {
      id: "ref_1",
      uid: "88299102",
      username: "CryptoWhale_88",
      email: "c***88@gmail.com",
      joinedAt: Date.now() - 86400000 * 2,
      totalVolumeUSDT: 48500.00,
      commissionEarnedUSDT: 121.25,
      status: "active",
    },
    {
      id: "ref_2",
      uid: "88294419",
      username: "SatoshiDream",
      email: "s***am@yahoo.com",
      joinedAt: Date.now() - 86400000 * 5,
      totalVolumeUSDT: 18200.00,
      commissionEarnedUSDT: 45.50,
      status: "active",
    },
    {
      id: "ref_3",
      uid: "88290312",
      username: "AlphaTraderX",
      email: "a***99@proton.me",
      joinedAt: Date.now() - 86400000 * 9,
      totalVolumeUSDT: 95400.00,
      commissionEarnedUSDT: 238.50,
      status: "active",
    },
  ],
};

const DEFAULT_ORDERS: PaperOrder[] = [
  {
    id: "ord_101",
    userId: "user_cb_8829",
    symbol: "BTCUSDT",
    side: "buy",
    type: "limit",
    price: 66500.00,
    amount: 0.15,
    filledAmount: 0,
    remainingAmount: 0.15,
    status: "open",
    fee: 9.97,
    feeAsset: "USDT",
    totalCost: 9975.00,
    createdAt: Date.now() - 1000 * 60 * 45,
    updatedAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "ord_102",
    userId: "user_cb_8829",
    symbol: "SOLUSDT",
    side: "sell",
    type: "limit",
    price: 185.00,
    amount: 10.0,
    filledAmount: 0,
    remainingAmount: 10.0,
    status: "open",
    fee: 1.85,
    feeAsset: "USDT",
    totalCost: 1850.00,
    createdAt: Date.now() - 1000 * 60 * 120,
    updatedAt: Date.now() - 1000 * 60 * 120,
  },
];

const DEFAULT_POSITIONS: Position[] = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    amount: 0.3542,
    entryPrice: 65400.00,
    currentPrice: 67850.50,
    totalCost: 23164.68,
    marketValue: 24032.65,
    unrealizedPnL: 867.97,
    unrealizedPnLPercent: 3.75,
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    amount: 2.1500,
    entryPrice: 3380.00,
    currentPrice: 3480.20,
    totalCost: 7267.00,
    marketValue: 7482.43,
    unrealizedPnL: 215.43,
    unrealizedPnLPercent: 2.96,
  },
];

class StoreManager {
  private state: ExchangeState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = {
      user: DEFAULT_USER,
      balances: DEFAULT_BALANCES,
      ledger: DEFAULT_LEDGER,
      openOrders: DEFAULT_ORDERS,
      orderHistory: [],
      tradeHistory: [
        {
          id: "trd_hist_1",
          orderId: "ord_past_1",
          symbol: "BTCUSDT",
          side: "buy",
          price: 65400.00,
          amount: 0.3542,
          fee: 23.16,
          total: 23164.68,
          timestamp: Date.now() - 86400000 * 2,
        },
        {
          id: "trd_hist_2",
          orderId: "ord_past_2",
          symbol: "ETHUSDT",
          side: "buy",
          price: 3380.00,
          amount: 2.15,
          fee: 7.27,
          total: 7267.00,
          timestamp: Date.now() - 86400000 * 1,
        },
      ],
      positions: DEFAULT_POSITIONS,
      p2pOffers: DEFAULT_P2P_OFFERS,
      p2pOrders: [],
      referralStats: DEFAULT_REFERRAL,
      backtestResults: [],
      adminMetrics: {
        totalVolumeUSDT: 48950240.00,
        activeUsers: 3418,
        openDisputes: 2,
        totalReserveUSDT: 1250000.00,
      },
    };

    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem("cryptobull_exchange_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.warn("Could not load stored exchange state:", e);
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cryptobull_exchange_state", JSON.stringify(this.state));
      } catch (e) {
        console.warn("Could not save exchange state to localStorage", e);
      }
    }
  }

  public getState(): ExchangeState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  // --- FAUCET & DEPOSITS ---
  public claimFaucet(amount: number = 5000) {
    const asset = "USDT";
    if (!this.state.balances[asset]) {
      this.state.balances[asset] = { asset, name: "Tether USD", free: 0, locked: 0, total: 0, usdValue: 0 };
    }
    this.state.balances[asset].free += amount;
    this.state.balances[asset].total += amount;
    this.state.balances[asset].usdValue += amount;

    const tx: LedgerTransaction = {
      id: `tx_faucet_${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      userId: this.state.user.id,
      asset,
      amount,
      type: "faucet_deposit",
      status: "completed",
      fee: 0,
      balanceAfter: this.state.balances[asset].total,
      description: "Demo Faucet Testnet Credit",
      timestamp: Date.now(),
    };

    this.state.ledger.unshift(tx);
    this.notify();
    return tx;
  }

  // --- INTERNAL TRANSFERS ---
  public executeInternalTransfer(req: InternalTransferRequest): { success: boolean; message: string; tx?: LedgerTransaction } {
    const bal = this.state.balances[req.asset];
    if (!bal || bal.free < req.amount) {
      return { success: false, message: `Insufficient free balance in ${req.asset}` };
    }

    bal.free -= req.amount;
    bal.total -= req.amount;
    bal.usdValue -= req.amount;

    const tx: LedgerTransaction = {
      id: `tx_trans_${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      userId: this.state.user.id,
      counterparty: req.recipientIdentifier,
      asset: req.asset,
      amount: req.amount,
      type: "internal_transfer_sent",
      status: "completed",
      fee: 0, // 0 fee for internal transfers!
      balanceAfter: bal.total,
      description: `Internal Transfer to ${req.recipientIdentifier} (${req.note || "No note"})`,
      timestamp: Date.now(),
    };

    this.state.ledger.unshift(tx);
    this.notify();
    return { success: true, message: `Successfully transferred ${req.amount} ${req.asset} to ${req.recipientIdentifier}`, tx };
  }

  // --- PAPER TRADING ORDER SUBMISSION ---
  public submitPaperOrder(order: Omit<PaperOrder, "id" | "userId" | "filledAmount" | "remainingAmount" | "status" | "createdAt" | "updatedAt">): PaperOrder {
    const id = `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const currentPrice = getCurrentPrice(order.symbol);
    const pair = SUPPORTED_PAIRS.find((p) => p.symbol === order.symbol) || SUPPORTED_PAIRS[0];
    const isMarket = order.type === "market";

    // Immediate fill for market orders or marketable limits
    const executionPrice = isMarket ? currentPrice : order.price;
    const shouldFillNow = isMarket || (order.side === "buy" ? currentPrice <= order.price : currentPrice >= order.price);

    const newOrder: PaperOrder = {
      ...order,
      id,
      userId: this.state.user.id,
      filledAmount: shouldFillNow ? order.amount : 0,
      remainingAmount: shouldFillNow ? 0 : order.amount,
      status: shouldFillNow ? "filled" : "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const quoteAsset = pair.quoteAsset;
    const baseAsset = pair.baseAsset;

    // Handle balance deductions / locks
    if (order.side === "buy") {
      const requiredQuote = order.totalCost;
      if (this.state.balances[quoteAsset]?.free >= requiredQuote) {
        if (shouldFillNow) {
          // Deduct quote asset
          this.state.balances[quoteAsset].free -= requiredQuote;
          this.state.balances[quoteAsset].total -= requiredQuote;

          // Add base asset
          if (!this.state.balances[baseAsset]) {
            this.state.balances[baseAsset] = { asset: baseAsset, name: baseAsset, free: 0, locked: 0, total: 0, usdValue: 0 };
          }
          this.state.balances[baseAsset].free += order.amount;
          this.state.balances[baseAsset].total += order.amount;
          this.state.balances[baseAsset].usdValue = this.state.balances[baseAsset].total * currentPrice;

          // Record trade history
          const trade: TradeHistoryItem = {
            id: `trd_${Date.now()}`,
            orderId: id,
            symbol: order.symbol,
            side: "buy",
            price: executionPrice,
            amount: order.amount,
            fee: order.fee,
            total: order.totalCost,
            timestamp: Date.now(),
          };
          this.state.tradeHistory.unshift(trade);
          this.state.orderHistory.unshift(newOrder);

          // Update position
          this.updatePositionOnFill(order.symbol, baseAsset, "buy", order.amount, executionPrice);
        } else {
          // Lock required quote funds
          this.state.balances[quoteAsset].free -= requiredQuote;
          this.state.balances[quoteAsset].locked += requiredQuote;
          this.state.openOrders.unshift(newOrder);
        }
      }
    } else {
      // Sell side
      if (this.state.balances[baseAsset]?.free >= order.amount) {
        if (shouldFillNow) {
          // Deduct base asset
          this.state.balances[baseAsset].free -= order.amount;
          this.state.balances[baseAsset].total -= order.amount;
          this.state.balances[baseAsset].usdValue = this.state.balances[baseAsset].total * currentPrice;

          // Add quote asset
          const receivedQuote = order.totalCost - order.fee;
          if (!this.state.balances[quoteAsset]) {
            this.state.balances[quoteAsset] = { asset: quoteAsset, name: quoteAsset, free: 0, locked: 0, total: 0, usdValue: 0 };
          }
          this.state.balances[quoteAsset].free += receivedQuote;
          this.state.balances[quoteAsset].total += receivedQuote;

          const trade: TradeHistoryItem = {
            id: `trd_${Date.now()}`,
            orderId: id,
            symbol: order.symbol,
            side: "sell",
            price: executionPrice,
            amount: order.amount,
            fee: order.fee,
            total: order.totalCost,
            timestamp: Date.now(),
          };
          this.state.tradeHistory.unshift(trade);
          this.state.orderHistory.unshift(newOrder);

          this.updatePositionOnFill(order.symbol, baseAsset, "sell", order.amount, executionPrice);
        } else {
          // Lock base asset
          this.state.balances[baseAsset].free -= order.amount;
          this.state.balances[baseAsset].locked += order.amount;
          this.state.openOrders.unshift(newOrder);
        }
      }
    }

    this.notify();
    return newOrder;
  }

  public cancelOrder(orderId: string): boolean {
    const idx = this.state.openOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) return false;

    const order = this.state.openOrders[idx];
    const pair = SUPPORTED_PAIRS.find((p) => p.symbol === order.symbol) || SUPPORTED_PAIRS[0];

    // Release locked balance
    if (order.side === "buy") {
      const quoteAsset = pair.quoteAsset;
      if (this.state.balances[quoteAsset]) {
        this.state.balances[quoteAsset].locked -= order.totalCost;
        this.state.balances[quoteAsset].free += order.totalCost;
      }
    } else {
      const baseAsset = pair.baseAsset;
      if (this.state.balances[baseAsset]) {
        this.state.balances[baseAsset].locked -= order.remainingAmount;
        this.state.balances[baseAsset].free += order.remainingAmount;
      }
    }

    order.status = "cancelled";
    this.state.openOrders.splice(idx, 1);
    this.state.orderHistory.unshift(order);
    this.notify();
    return true;
  }

  private updatePositionOnFill(symbol: string, baseAsset: string, side: "buy" | "sell", amount: number, price: number) {
    const existing = this.state.positions.find((p) => p.symbol === symbol);
    if (side === "buy") {
      if (existing) {
        const newTotalCost = existing.totalCost + amount * price;
        const newAmount = existing.amount + amount;
        existing.entryPrice = newTotalCost / newAmount;
        existing.amount = newAmount;
        existing.totalCost = newTotalCost;
        existing.currentPrice = price;
        existing.marketValue = newAmount * price;
        existing.unrealizedPnL = existing.marketValue - existing.totalCost;
        existing.unrealizedPnLPercent = (existing.unrealizedPnL / existing.totalCost) * 100;
      } else {
        this.state.positions.push({
          symbol,
          baseAsset,
          amount,
          entryPrice: price,
          currentPrice: price,
          totalCost: amount * price,
          marketValue: amount * price,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
        });
      }
    } else {
      if (existing) {
        existing.amount = Math.max(0, existing.amount - amount);
        if (existing.amount === 0) {
          this.state.positions = this.state.positions.filter((p) => p.symbol !== symbol);
        } else {
          existing.totalCost = existing.amount * existing.entryPrice;
          existing.currentPrice = price;
          existing.marketValue = existing.amount * price;
          existing.unrealizedPnL = existing.marketValue - existing.totalCost;
          existing.unrealizedPnLPercent = (existing.unrealizedPnL / existing.totalCost) * 100;
        }
      }
    }
  }

  // --- P2P ORDER FLOW ---
  public createP2POrder(offerId: string, fiatAmount: number, paymentMethod: string): P2POrder {
    const offer = this.state.p2pOffers.find((o) => o.id === offerId) || this.state.p2pOffers[0];
    const cryptoAmount = Number((fiatAmount / offer.pricePerUnit).toFixed(2));
    const orderNumber = `P2P-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: P2POrder = {
      id: `p2p_ord_${Date.now()}`,
      orderNumber,
      offerId,
      buyerId: offer.side === "sell" ? this.state.user.id : offer.advertiserId,
      buyerName: offer.side === "sell" ? this.state.user.username : offer.advertiserName,
      sellerId: offer.side === "sell" ? offer.advertiserId : this.state.user.id,
      sellerName: offer.side === "sell" ? offer.advertiserName : this.state.user.username,
      asset: offer.asset,
      cryptoAmount,
      fiatCurrency: offer.fiatCurrency,
      fiatAmount,
      pricePerUnit: offer.pricePerUnit,
      status: "FUNDS_RESERVED", // Escrow instantly locks seller's asset
      paymentMethod,
      paymentDetails: `${paymentMethod} Ref: CB-${Math.floor(10000 + Math.random() * 90000)} | Account: 4892-XXXX-1102`,
      referenceCode: `CB-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins payment window
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: "m_1",
          sender: "System Escrow",
          text: `Escrow has locked ${cryptoAmount} USDT. Buyer please transfer ${fiatAmount} ${offer.fiatCurrency} via ${paymentMethod} within 15 minutes.`,
          timestamp: Date.now(),
        },
      ],
    };

    this.state.p2pOrders.unshift(order);
    this.notify();
    return order;
  }

  public updateP2POrderStatus(orderId: string, status: P2POrderStatus, note?: string): boolean {
    const order = this.state.p2pOrders.find((o) => o.id === orderId);
    if (!order) return false;

    order.status = status;
    order.updatedAt = Date.now();

    if (note) {
      order.messages.push({
        id: `m_${Date.now()}`,
        sender: "System",
        text: note,
        timestamp: Date.now(),
      });
    }

    // Settlement on COMPLETED
    if (status === "COMPLETED") {
      const isUserBuyer = order.buyerId === this.state.user.id;
      if (isUserBuyer) {
        if (!this.state.balances[order.asset]) {
          this.state.balances[order.asset] = { asset: order.asset, name: "Tether USD", free: 0, locked: 0, total: 0, usdValue: 0 };
        }
        this.state.balances[order.asset].free += order.cryptoAmount;
        this.state.balances[order.asset].total += order.cryptoAmount;
        this.state.balances[order.asset].usdValue += order.cryptoAmount;

        this.state.ledger.unshift({
          id: `tx_p2p_${Date.now()}`,
          txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
          userId: this.state.user.id,
          counterparty: order.sellerName,
          asset: order.asset,
          amount: order.cryptoAmount,
          type: "p2p_released",
          status: "completed",
          fee: 0,
          balanceAfter: this.state.balances[order.asset].total,
          description: `P2P Order ${order.orderNumber} Completed - Received ${order.cryptoAmount} USDT`,
          timestamp: Date.now(),
        });
      }
    }

    this.notify();
    return true;
  }

  // --- QUANTITATIVE BACKTESTING ---
  public addBacktestResult(result: BacktestResult) {
    this.state.backtestResults.unshift(result);
    this.notify();
  }

  // --- SECURITY / PROFILE ---
  public updateSecurityProfile(updates: Partial<UserProfile>) {
    this.state.user = { ...this.state.user, ...updates };
    this.notify();
  }
}

// Global Singleton Instance
export const store = new StoreManager();
