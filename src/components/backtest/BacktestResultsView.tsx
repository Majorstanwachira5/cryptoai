"use client";

import React, { useState } from "react";
import { BacktestResult } from "@/types/backtest";
import { formatCurrency, formatPercent, formatNumber, formatDate, formatTimestamp } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Activity,
  Award,
  AlertTriangle,
  Download,
  Calendar,
} from "lucide-react";

interface BacktestResultsViewProps {
  result: BacktestResult;
}

export default function BacktestResultsView({ result }: BacktestResultsViewProps) {
  const [activeTab, setActiveTab] = useState<"curve" | "trades">("curve");
  const { metrics, equityCurve, trades, config } = result;
  const isNetProfit = metrics.totalReturnPercent >= 0;

  // Simple clean SVG line calculation for Equity Curve
  const minEquity = Math.min(...equityCurve.map((p) => p.equity)) * 0.98;
  const maxEquity = Math.max(...equityCurve.map((p) => p.equity)) * 1.02;
  const range = maxEquity - minEquity || 1;

  const width = 800;
  const height = 220;

  const points = equityCurve
    .map((p, idx) => {
      const x = (idx / (equityCurve.length - 1)) * width;
      const y = height - ((p.equity - minEquity) / range) * (height - 20) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const benchmarkPoints = equityCurve
    .map((p, idx) => {
      const x = (idx / (equityCurve.length - 1)) * width;
      const y = height - ((p.benchmarkEquity - minEquity) / range) * (height - 20) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card select-none text-xs mt-6">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-extrabold text-white">{config.name}</span>
            <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-mono font-bold">
              Status: {result.status.toUpperCase()}
            </span>
          </div>
          <div className="text-[11px] text-[#848E9C] mt-1 flex flex-wrap gap-3">
            <span>Bars Analyzed: {result.totalBars}</span>
            <span>·</span>
            <span>Execution Duration: {result.executionTimeMs}ms</span>
            <span>·</span>
            <span>Execution Model: Next-Bar Open Fill</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-[#848E9C] block">Final Synthetic Capital</span>
            <span className="font-mono text-base font-extrabold text-white tabular-nums">
              {formatCurrency(metrics.finalEquity)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 my-4">
        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[10px] text-[#848E9C] font-semibold">Total Net Return</div>
          <div className={`font-mono text-base font-extrabold mt-1 tabular-nums ${isNetProfit ? "text-bull" : "text-bear"}`}>
            {formatPercent(metrics.totalReturnPercent)}
          </div>
          <div className="text-[9px] text-[#5E6673] mt-0.5">Benchmark: {formatPercent(metrics.benchmarkReturnPercent)}</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[10px] text-[#848E9C] font-semibold">Max Drawdown</div>
          <div className="font-mono text-base font-extrabold text-bear mt-1 tabular-nums">
            -{metrics.maxDrawdownPercent.toFixed(2)}%
          </div>
          <div className="text-[9px] text-[#5E6673] mt-0.5">Peak-to-trough drop</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[10px] text-[#848E9C] font-semibold">Win Rate</div>
          <div className="font-mono text-base font-extrabold text-white mt-1 tabular-nums">
            {metrics.winRatePercent}%
          </div>
          <div className="text-[9px] text-[#5E6673] mt-0.5">{metrics.winningTrades}W / {metrics.losingTrades}L</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[10px] text-[#848E9C] font-semibold">Profit Factor</div>
          <div className="font-mono text-base font-extrabold text-[#F0B90B] mt-1 tabular-nums">
            {metrics.profitFactor}
          </div>
          <div className="text-[9px] text-[#5E6673] mt-0.5">Gross gains / losses</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[10px] text-[#848E9C] font-semibold">Total Trades</div>
          <div className="font-mono text-base font-extrabold text-white mt-1 tabular-nums">
            {metrics.totalTrades}
          </div>
          <div className="text-[9px] text-[#5E6673] mt-0.5">Avg: {formatPercent(metrics.averageTradeReturnPercent)}/trd</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[10px] text-[#848E9C] font-semibold">Total Fees Paid</div>
          <div className="font-mono text-base font-extrabold text-[#848E9C] mt-1 tabular-nums">
            {formatCurrency(metrics.totalFeesPaid)}
          </div>
          <div className="text-[9px] text-[#5E6673] mt-0.5">0.1% maker/taker fee</div>
        </div>
      </div>

      {/* Tabs: Equity Curve vs Trade List */}
      <div className="border-b border-[#2B313A] flex items-center justify-between pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("curve")}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              activeTab === "curve" ? "bg-[#2B313A] text-[#F0B90B]" : "text-[#848E9C] hover:text-white"
            }`}
          >
            Equity Growth Curve vs Benchmark
          </button>
          <button
            onClick={() => setActiveTab("trades")}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              activeTab === "trades" ? "bg-[#2B313A] text-[#F0B90B]" : "text-[#848E9C] hover:text-white"
            }`}
          >
            Trade-by-Trade Execution Log ({trades.length})
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[10px]">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-0.5 bg-bull" />
            <span className="text-[#848E9C]">Strategy Equity</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-0.5 bg-[#848E9C]" />
            <span className="text-[#848E9C]">Buy & Hold Benchmark</span>
          </div>
        </div>
      </div>

      {/* Equity Curve Display */}
      {activeTab === "curve" && (
        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="relative w-full h-56 overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full preserve-3d"
            >
              {/* Benchmark Curve */}
              <polyline
                fill="none"
                stroke="#5E6673"
                strokeWidth="1.5"
                strokeDasharray="4"
                points={benchmarkPoints}
              />
              {/* Strategy Equity Curve */}
              <polyline
                fill="none"
                stroke={isNetProfit ? "#0ECB81" : "#F6465D"}
                strokeWidth="2.5"
                points={points}
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-[#5E6673] px-2 pt-2 border-t border-[#1E2329]">
            <span>Start: $10,000.00</span>
            <span>Historical Simulation Bars (Zero Look-ahead Bias)</span>
            <span className={isNetProfit ? "text-bull" : "text-bear"}>
              End: {formatCurrency(metrics.finalEquity)}
            </span>
          </div>
        </div>
      )}

      {/* Trade Log Table */}
      {activeTab === "trades" && (
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs tabular-nums">
            <thead>
              <tr className="text-[#848E9C] border-b border-[#23272E] text-[10px] font-semibold">
                <th className="py-2">Entry Time</th>
                <th className="py-2">Exit Time</th>
                <th className="py-2 text-right">Entry Price</th>
                <th className="py-2 text-right">Exit Price</th>
                <th className="py-2 text-right">Size</th>
                <th className="py-2 text-right">Net PnL</th>
                <th className="py-2 text-right">Return %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2329] text-[11px]">
              {trades.map((trd) => {
                const isTradeProfit = trd.netPnL > 0;
                return (
                  <tr key={trd.id} className="hover:bg-[#1E2329]">
                    <td className="py-2 text-[#848E9C] font-mono">{formatDate(trd.entryTime)}</td>
                    <td className="py-2 text-[#848E9C] font-mono">{formatDate(trd.exitTime)}</td>
                    <td className="py-2 text-right font-mono text-white">${trd.entryPrice.toFixed(2)}</td>
                    <td className="py-2 text-right font-mono text-white">${trd.exitPrice.toFixed(2)}</td>
                    <td className="py-2 text-right font-mono text-[#848E9C]">{trd.amount}</td>
                    <td className={`py-2 text-right font-mono font-bold ${isTradeProfit ? "text-bull" : "text-bear"}`}>
                      {formatCurrency(trd.netPnL)}
                    </td>
                    <td className={`py-2 text-right font-mono font-bold ${isTradeProfit ? "text-bull" : "text-bear"}`}>
                      {formatPercent(trd.returnPercent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Risk Notice */}
      <div className="mt-4 p-2.5 rounded bg-[#0B0E11] border border-[#2B313A] flex items-start space-x-2 text-[10px] text-[#848E9C]">
        <AlertTriangle className="w-4 h-4 text-[#F0B90B] shrink-0 mt-0.5" />
        <span>
          <strong>Backtesting Disclaimer:</strong> Past performance does not guarantee future live returns.
          The backtesting engine models historical tick data without look-ahead bias, but real market liquidity and execution slippage may vary under extreme volatility.
        </span>
      </div>
    </div>
  );
}
