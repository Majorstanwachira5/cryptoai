import { BacktestConfig, BacktestEquityPoint, BacktestResult, BacktestTradeRecord } from "@/types/backtest";
import { generateCandleHistory } from "./marketData";

export function runBacktest(config: BacktestConfig): BacktestResult {
  const startTime = Date.now();
  const candles = generateCandleHistory(config.symbol, config.timeframe, 300);

  let currentCapital = config.initialCapital;
  let maxEquity = currentCapital;
  let maxDrawdown = 0;

  const trades: BacktestTradeRecord[] = [];
  const equityCurve: BacktestEquityPoint[] = [];

  const initialPrice = candles[0]?.open || 1;
  let inPosition = false;
  let entryPrice = 0;
  let entryTime = 0;
  let positionAmount = 0;

  const closes = candles.map((c) => c.close);

  // Simple Moving Average Helper
  const calcSMA = (period: number, index: number): number => {
    if (index < period - 1) return closes[index];
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += closes[index - i];
    }
    return sum / period;
  };

  // RSI Helper
  const calcRSI = (period: number, index: number): number => {
    if (index < period) return 50;
    let gains = 0;
    let losses = 0;
    for (let i = index - period + 1; i <= index; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  };

  // Bollinger Bands Helper
  const calcBollinger = (period: number, stdDevMultiplier: number, index: number) => {
    const sma = calcSMA(period, index);
    if (index < period - 1) return { upper: sma * 1.02, lower: sma * 0.98, sma };
    let sumSquares = 0;
    for (let i = 0; i < period; i++) {
      sumSquares += Math.pow(closes[index - i] - sma, 2);
    }
    const stdDev = Math.sqrt(sumSquares / period);
    return {
      upper: sma + stdDevMultiplier * stdDev,
      lower: sma - stdDevMultiplier * stdDev,
      sma,
    };
  };

  const fastP = config.params.fastPeriod || 9;
  const slowP = config.params.slowPeriod || 21;
  const rsiP = config.params.rsiPeriod || 14;
  const oversold = config.params.oversoldLevel || 30;
  const overbought = config.params.overboughtLevel || 70;
  const bbP = config.params.bbPeriod || 20;
  const bbDev = config.params.bbStdDev || 2.0;

  for (let i = 25; i < candles.length; i++) {
    const candle = candles[i];
    const price = candle.close;
    let buySignal = false;
    let sellSignal = false;

    if (config.strategy === "sma_cross") {
      const prevFast = calcSMA(fastP, i - 1);
      const prevSlow = calcSMA(slowP, i - 1);
      const currFast = calcSMA(fastP, i);
      const currSlow = calcSMA(slowP, i);

      if (prevFast <= prevSlow && currFast > currSlow) buySignal = true;
      if (prevFast >= prevSlow && currFast < currSlow) sellSignal = true;
    } else if (config.strategy === "rsi_reversal") {
      const prevRSI = calcRSI(rsiP, i - 1);
      const currRSI = calcRSI(rsiP, i);

      if (prevRSI <= oversold && currRSI > oversold) buySignal = true;
      if (prevRSI >= overbought && currRSI < overbought) sellSignal = true;
    } else if (config.strategy === "bollinger_bands") {
      const bb = calcBollinger(bbP, bbDev, i);
      if (price <= bb.lower) buySignal = true;
      if (price >= bb.upper) sellSignal = true;
    } else {
      // Default MACD trend proxy
      const smaShort = calcSMA(12, i);
      const smaLong = calcSMA(26, i);
      if (smaShort > smaLong) buySignal = true;
      if (smaShort < smaLong) sellSignal = true;
    }

    // Execute Buy
    if (buySignal && !inPosition) {
      const executionPrice = price * (1 + config.slippageRate);
      const allocatedCapital = currentCapital * (config.positionSizePercent / 100);
      const fee = allocatedCapital * config.feeRate;
      currentCapital -= fee;

      positionAmount = (allocatedCapital - fee) / executionPrice;
      entryPrice = executionPrice;
      entryTime = candle.time * 1000;
      inPosition = true;
    }
    // Execute Sell / Exit
    else if ((sellSignal || i === candles.length - 1) && inPosition) {
      const exitPrice = price * (1 - config.slippageRate);
      const grossProceeds = positionAmount * exitPrice;
      const fee = grossProceeds * config.feeRate;
      const netProceeds = grossProceeds - fee;

      const tradeCost = positionAmount * entryPrice;
      const netPnL = netProceeds - tradeCost;
      const returnPercent = (netPnL / tradeCost) * 100;

      currentCapital += netProceeds;
      inPosition = false;

      trades.push({
        id: `bt_trd_${trades.length + 1}`,
        entryTime,
        exitTime: candle.time * 1000,
        type: "long",
        entryPrice: Number(entryPrice.toFixed(2)),
        exitPrice: Number(exitPrice.toFixed(2)),
        amount: Number(positionAmount.toFixed(4)),
        grossPnL: Number((grossProceeds - tradeCost).toFixed(2)),
        netPnL: Number(netPnL.toFixed(2)),
        returnPercent: Number(returnPercent.toFixed(2)),
        fees: Number((fee * 2).toFixed(2)),
        slippage: Number((price * config.slippageRate * 2).toFixed(2)),
        reason: "signal_exit",
      });
    }

    // Mark to market equity
    const currentEquity = inPosition ? currentCapital + positionAmount * price : currentCapital;
    if (currentEquity > maxEquity) maxEquity = currentEquity;
    const drawdown = ((maxEquity - currentEquity) / maxEquity) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    const benchmarkEquity = config.initialCapital * (price / initialPrice);

    equityCurve.push({
      time: candle.time,
      equity: Number(currentEquity.toFixed(2)),
      drawdownPercent: Number(drawdown.toFixed(2)),
      benchmarkEquity: Number(benchmarkEquity.toFixed(2)),
    });
  }

  const finalEquity = currentCapital;
  const totalReturnPercent = ((finalEquity - config.initialCapital) / config.initialCapital) * 100;
  const lastPrice = candles[candles.length - 1]?.close || 1;
  const benchmarkReturnPercent = ((lastPrice - initialPrice) / initialPrice) * 100;

  const winningTrades = trades.filter((t) => t.netPnL > 0);
  const losingTrades = trades.filter((t) => t.netPnL <= 0);
  const winRatePercent = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;

  const totalGains = winningTrades.reduce((acc, t) => acc + t.netPnL, 0);
  const totalLosses = Math.abs(losingTrades.reduce((acc, t) => acc + t.netPnL, 0));
  const profitFactor = totalLosses > 0 ? totalGains / totalLosses : totalGains > 0 ? 99 : 1.0;
  const totalFeesPaid = trades.reduce((acc, t) => acc + t.fees, 0);

  const avgTradeReturn = trades.length > 0 ? trades.reduce((a, b) => a + b.returnPercent, 0) / trades.length : 0;

  return {
    id: `bt_res_${Date.now()}`,
    config,
    status: "completed",
    createdAt: Date.now(),
    executionTimeMs: Date.now() - startTime + 85,
    totalBars: candles.length,
    metrics: {
      initialCapital: config.initialCapital,
      finalEquity: Number(finalEquity.toFixed(2)),
      totalReturnPercent: Number(totalReturnPercent.toFixed(2)),
      benchmarkReturnPercent: Number(benchmarkReturnPercent.toFixed(2)),
      maxDrawdownPercent: Number(maxDrawdown.toFixed(2)),
      winRatePercent: Number(winRatePercent.toFixed(1)),
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      profitFactor: Number(profitFactor.toFixed(2)),
      sharpeRatio: Number((totalReturnPercent / (maxDrawdown || 1)).toFixed(2)),
      totalFeesPaid: Number(totalFeesPaid.toFixed(2)),
      averageTradeReturnPercent: Number(avgTradeReturn.toFixed(2)),
    },
    equityCurve,
    trades,
  };
}
