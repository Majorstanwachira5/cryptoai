export type StrategyType = "sma_cross" | "rsi_reversal" | "bollinger_bands" | "macd_trend";

export interface StrategyParameters {
  // SMA
  fastPeriod?: number;
  slowPeriod?: number;
  // RSI
  rsiPeriod?: number;
  oversoldLevel?: number;
  overboughtLevel?: number;
  // Bollinger
  bbPeriod?: number;
  bbStdDev?: number;
  // Stop & Take profit
  stopLossPercent?: number;
  takeProfitPercent?: number;
}

export interface BacktestConfig {
  id: string;
  name: string;
  strategy: StrategyType;
  symbol: string;
  timeframe: "1m" | "15m" | "1h" | "4h" | "1d";
  startDate: string;
  endDate: string;
  initialCapital: number;
  positionSizePercent: number; // e.g. 50% or 100%
  feeRate: number; // e.g. 0.001 (0.1%)
  slippageRate: number; // e.g. 0.0005 (0.05%)
  params: StrategyParameters;
}

export interface BacktestTradeRecord {
  id: string;
  entryTime: number;
  exitTime: number;
  type: "long";
  entryPrice: number;
  exitPrice: number;
  amount: number;
  grossPnL: number;
  netPnL: number;
  returnPercent: number;
  fees: number;
  slippage: number;
  reason: "take_profit" | "stop_loss" | "signal_exit";
}

export interface BacktestEquityPoint {
  time: number;
  equity: number;
  drawdownPercent: number;
  benchmarkEquity: number;
}

export interface BacktestResult {
  id: string;
  config: BacktestConfig;
  status: "completed" | "running" | "failed";
  createdAt: number;
  executionTimeMs: number;
  totalBars: number;
  metrics: {
    initialCapital: number;
    finalEquity: number;
    totalReturnPercent: number;
    benchmarkReturnPercent: number;
    maxDrawdownPercent: number;
    winRatePercent: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    profitFactor: number;
    sharpeRatio: number;
    totalFeesPaid: number;
    averageTradeReturnPercent: number;
  };
  equityCurve: BacktestEquityPoint[];
  trades: BacktestTradeRecord[];
}
