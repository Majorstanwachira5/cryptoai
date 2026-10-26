"use client";

import React, { useState } from "react";
import { BacktestConfig, BacktestResult, StrategyType } from "@/types/backtest";
import { runBacktest } from "@/lib/backtestEngine";
import { store } from "@/lib/store";
import { Cpu, Play, Sliders, ShieldAlert, Sparkles } from "lucide-react";

interface BacktestWizardProps {
  onBacktestComplete: (result: BacktestResult) => void;
}

export default function BacktestWizard({ onBacktestComplete }: BacktestWizardProps) {
  const [strategy, setStrategy] = useState<StrategyType>("sma_cross");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState<"1m" | "15m" | "1h" | "4h" | "1d">("1h");
  const [initialCapital, setInitialCapital] = useState(10000);
  const [positionSize, setPositionSize] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  // Strategy params
  const [fastPeriod, setFastPeriod] = useState(9);
  const [slowPeriod, setSlowPeriod] = useState(21);
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [oversold, setOversold] = useState(30);
  const [overbought, setOverbought] = useState(70);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const config: BacktestConfig = {
        id: `cfg_${Date.now()}`,
        name: `${strategy.toUpperCase()} ${symbol} [${timeframe}]`,
        strategy,
        symbol,
        timeframe,
        startDate: "2026-01-01",
        endDate: "2026-10-23",
        initialCapital,
        positionSizePercent: positionSize,
        feeRate: 0.001,
        slippageRate: 0.0005,
        params: {
          fastPeriod,
          slowPeriod,
          rsiPeriod,
          oversoldLevel: oversold,
          overboughtLevel: overbought,
        },
      };

      const result = runBacktest(config);
      store.addBacktestResult(result);
      onBacktestComplete(result);
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card select-none text-xs">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#2B313A]">
        <div className="w-8 h-8 rounded bg-purple-900/50 border border-purple-700/60 flex items-center justify-center text-purple-400">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-white">Quantitative Backtesting Lab</h3>
          <p className="text-[11px] text-[#848E9C]">
            Simulate statistical algorithmic trading models over verified historical candlestick bars.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        {/* Strategy Selection */}
        <div>
          <label className="block text-[#848E9C] font-semibold mb-1.5">Strategy Algorithm</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as StrategyType)}
            className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#F0B90B] cursor-pointer"
          >
            <option value="sma_cross">Moving Average Crossover (Fast/Slow)</option>
            <option value="rsi_reversal">RSI Mean Reversion (30/70)</option>
            <option value="bollinger_bands">Bollinger Bands Volatility Breakout</option>
            <option value="macd_trend">MACD Dual-Momentum Trend</option>
          </select>
        </div>

        {/* Symbol */}
        <div>
          <label className="block text-[#848E9C] font-semibold mb-1.5">Market Pair</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#F0B90B] cursor-pointer"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
          </select>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-[#848E9C] font-semibold mb-1.5">Candle Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#F0B90B] cursor-pointer"
          >
            <option value="1m">1 Minute (High Frequency)</option>
            <option value="15m">15 Minutes (Intraday)</option>
            <option value="1h">1 Hour (Swing Standard)</option>
            <option value="4h">4 Hours (Trend Following)</option>
            <option value="1d">1 Day (Macro Positioning)</option>
          </select>
        </div>
      </div>

      {/* Dynamic Strategy Parameters */}
      <div className="bg-[#0B0E11] p-4 rounded border border-[#2B313A] mt-4">
        <div className="flex items-center space-x-1.5 text-white font-bold mb-3">
          <Sliders className="w-3.5 h-3.5 text-[#F0B90B]" />
          <span>Execution & Indicator Parameters</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] text-[#848E9C] mb-1">Starting Capital (USDT)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full bg-[#181A20] border border-[#2B313A] rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#848E9C] mb-1">Position Size (%)</label>
            <input
              type="number"
              value={positionSize}
              onChange={(e) => setPositionSize(Number(e.target.value))}
              className="w-full bg-[#181A20] border border-[#2B313A] rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
            />
          </div>

          {strategy === "sma_cross" && (
            <>
              <div>
                <label className="block text-[10px] text-[#848E9C] mb-1">Fast SMA Period</label>
                <input
                  type="number"
                  value={fastPeriod}
                  onChange={(e) => setFastPeriod(Number(e.target.value))}
                  className="w-full bg-[#181A20] border border-[#2B313A] rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#848E9C] mb-1">Slow SMA Period</label>
                <input
                  type="number"
                  value={slowPeriod}
                  onChange={(e) => setSlowPeriod(Number(e.target.value))}
                  className="w-full bg-[#181A20] border border-[#2B313A] rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </>
          )}

          {strategy === "rsi_reversal" && (
            <>
              <div>
                <label className="block text-[10px] text-[#848E9C] mb-1">RSI Oversold Level</label>
                <input
                  type="number"
                  value={oversold}
                  onChange={(e) => setOversold(Number(e.target.value))}
                  className="w-full bg-[#181A20] border border-[#2B313A] rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#848E9C] mb-1">RSI Overbought Level</label>
                <input
                  type="number"
                  value={overbought}
                  onChange={(e) => setOverbought(Number(e.target.value))}
                  className="w-full bg-[#181A20] border border-[#2B313A] rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Run Action */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[11px] text-[#848E9C]">
          Assumptions: 0.10% Maker/Taker Fee · 0.05% Slippage Buffer · Strict Bar-Close Signal Trigger
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-extrabold uppercase tracking-wide transition-all shadow-md shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isRunning ? "Simulating Bars..." : "Run Quantitative Backtest"}</span>
        </button>
      </div>
    </div>
  );
}
