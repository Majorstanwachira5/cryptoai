import { KlineCandle, MarketTicker, OrderBook, OrderBookLevel, MarketTrade } from "@/types/market";

export const SUPPORTED_PAIRS = [
  { symbol: "BTCUSDT", displayName: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT", defaultPrice: 67850.50, precision: 2, amountPrecision: 4 },
  { symbol: "ETHUSDT", displayName: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT", defaultPrice: 3480.20, precision: 2, amountPrecision: 3 },
  { symbol: "SOLUSDT", displayName: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT", defaultPrice: 178.60, precision: 2, amountPrecision: 2 },
  { symbol: "BNBUSDT", displayName: "BNB/USDT", baseAsset: "BNB", quoteAsset: "USDT", defaultPrice: 592.40, precision: 2, amountPrecision: 2 },
  { symbol: "XRPUSDT", displayName: "XRP/USDT", baseAsset: "XRP", quoteAsset: "USDT", defaultPrice: 0.5420, precision: 4, amountPrecision: 1 },
  { symbol: "DOGEUSDT", displayName: "DOGE/USDT", baseAsset: "DOGE", quoteAsset: "USDT", defaultPrice: 0.1412, precision: 4, amountPrecision: 1 },
  { symbol: "ADAUSDT", displayName: "ADA/USDT", baseAsset: "ADA", quoteAsset: "USDT", defaultPrice: 0.3620, precision: 4, amountPrecision: 1 },
  { symbol: "AVAXUSDT", displayName: "AVAX/USDT", baseAsset: "AVAX", quoteAsset: "USDT", defaultPrice: 28.75, precision: 2, amountPrecision: 2 },
];

// In-memory price state cache
const currentPrices: Record<string, number> = {};
SUPPORTED_PAIRS.forEach((p) => {
  currentPrices[p.symbol] = p.defaultPrice;
});

export function getCurrentPrice(symbol: string): number {
  return currentPrices[symbol] || 67850.50;
}

export function updateCurrentPrice(symbol: string, newPrice: number) {
  currentPrices[symbol] = newPrice;
}

/**
 * Generate synthetic or fetched 24h tickers
 */
export function getInitialTickers(): MarketTicker[] {
  return SUPPORTED_PAIRS.map((pair) => {
    const price = currentPrices[pair.symbol];
    const changePercent = (Math.sin(pair.defaultPrice) * 5.2);
    const change = price * (changePercent / 100);
    const high = price * 1.032;
    const low = price * 0.968;
    const volume = (pair.defaultPrice > 1000 ? 28450 : 850000) * (0.8 + Math.random() * 0.4);

    // generate 14-point mini sparkline
    const sparkline: number[] = [];
    let p = price * (1 - changePercent / 100);
    for (let i = 0; i < 14; i++) {
      p += (Math.random() - 0.48) * (price * 0.005);
      sparkline.push(Number(p.toFixed(pair.precision)));
    }
    sparkline.push(price);

    return {
      symbol: pair.symbol,
      baseAsset: pair.baseAsset,
      quoteAsset: pair.quoteAsset,
      price: Number(price.toFixed(pair.precision)),
      change24h: Number(change.toFixed(pair.precision)),
      changePercent24h: Number(changePercent.toFixed(2)),
      high24h: Number(high.toFixed(pair.precision)),
      low24h: Number(low.toFixed(pair.precision)),
      volume24h: Number(volume.toFixed(2)),
      quoteVolume24h: Number((volume * price).toFixed(2)),
      sparkline,
    };
  });
}

/**
 * Generate historical candle bars for Lightweight Charts
 */
export function generateCandleHistory(
  symbol: string,
  timeframe: string = "1h",
  count: number = 180
): KlineCandle[] {
  const pair = SUPPORTED_PAIRS.find((p) => p.symbol === symbol) || SUPPORTED_PAIRS[0];
  const basePrice = currentPrices[pair.symbol] || pair.defaultPrice;
  const candles: KlineCandle[] = [];

  // interval in seconds
  let intervalSeconds = 3600;
  if (timeframe === "1m") intervalSeconds = 60;
  else if (timeframe === "15m") intervalSeconds = 900;
  else if (timeframe === "1h") intervalSeconds = 3600;
  else if (timeframe === "4h") intervalSeconds = 14400;
  else if (timeframe === "1d") intervalSeconds = 86400;

  const nowSec = Math.floor(Date.now() / 1000);
  let currentClose = basePrice * 0.88; // start lower so it has an upward trajectory

  // volatility scalar based on price
  const volatility = basePrice * 0.006;

  for (let i = count; i >= 0; i--) {
    const time = nowSec - i * intervalSeconds;
    const change = (Math.random() - 0.48) * volatility;
    const open = currentClose;
    const close = Math.max(open * 0.2, open + change);
    const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
    const volume = (Math.random() * 50 + 10) * (basePrice > 1000 ? 1 : 100);

    candles.push({
      time,
      open: Number(open.toFixed(pair.precision)),
      high: Number(high.toFixed(pair.precision)),
      low: Number(low.toFixed(pair.precision)),
      close: Number(close.toFixed(pair.precision)),
      volume: Number(volume.toFixed(2)),
    });

    currentClose = close;
  }

  // Ensure last candle matches current price
  if (candles.length > 0) {
    candles[candles.length - 1].close = basePrice;
  }

  return candles;
}

/**
 * Generate realistic dense Order Book snapshot
 */
export function generateOrderBook(symbol: string, depth: number = 15): OrderBook {
  const pair = SUPPORTED_PAIRS.find((p) => p.symbol === symbol) || SUPPORTED_PAIRS[0];
  const midPrice = currentPrices[pair.symbol] || pair.defaultPrice;
  const tickSize = Math.max(0.01, midPrice * 0.0001);

  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];

  let bidCumulative = 0;
  let askCumulative = 0;

  // Asks (above mid price) - sorted ascending in price, but usually shown descending in UI
  for (let i = 1; i <= depth; i++) {
    const price = Number((midPrice + i * tickSize).toFixed(pair.precision));
    const amount = Number(((0.2 + Math.random() * 2.5) * (midPrice > 1000 ? 1 : 40)).toFixed(pair.amountPrecision));
    askCumulative += amount;
    asks.push({
      price,
      amount,
      total: Number(askCumulative.toFixed(pair.amountPrecision)),
    });
  }

  // Bids (below mid price) - sorted descending in price
  for (let i = 1; i <= depth; i++) {
    const price = Number((midPrice - i * tickSize).toFixed(pair.precision));
    const amount = Number(((0.2 + Math.random() * 2.5) * (midPrice > 1000 ? 1 : 40)).toFixed(pair.amountPrecision));
    bidCumulative += amount;
    bids.push({
      price,
      amount,
      total: Number(bidCumulative.toFixed(pair.amountPrecision)),
    });
  }

  const bestAsk = asks[0]?.price || midPrice;
  const bestBid = bids[0]?.price || midPrice;
  const spread = Number((bestAsk - bestBid).toFixed(pair.precision));
  const spreadPercent = Number(((spread / midPrice) * 100).toFixed(3));

  return {
    symbol,
    bids,
    asks,
    lastPrice: midPrice,
    spread,
    spreadPercent,
  };
}

/**
 * Generate realistic recent trades stream
 */
export function generateRecentTrades(symbol: string, count: number = 20): MarketTrade[] {
  const pair = SUPPORTED_PAIRS.find((p) => p.symbol === symbol) || SUPPORTED_PAIRS[0];
  const price = currentPrices[pair.symbol] || pair.defaultPrice;
  const trades: MarketTrade[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const delta = (Math.random() - 0.5) * (price * 0.0005);
    const tradePrice = Number((price + delta).toFixed(pair.precision));
    const amount = Number(((0.05 + Math.random() * 1.8) * (price > 1000 ? 1 : 50)).toFixed(pair.amountPrecision));

    trades.push({
      id: `trade_${now - i * 1500}_${i}`,
      price: tradePrice,
      amount,
      time: now - i * (800 + Math.floor(Math.random() * 2200)),
      side,
    });
  }

  return trades;
}
