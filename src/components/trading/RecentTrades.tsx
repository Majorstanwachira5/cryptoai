"use client";

import React, { useState, useEffect } from "react";
import { generateRecentTrades } from "@/lib/marketData";
import { MarketTrade } from "@/types/market";
import { formatNumber, formatTimestamp } from "@/lib/utils";

interface RecentTradesProps {
  symbol: string;
}

export default function RecentTrades({ symbol }: RecentTradesProps) {
  const [trades, setTrades] = useState<MarketTrade[]>([]);

  useEffect(() => {
    setTrades(generateRecentTrades(symbol, 24));

    // Simulate incoming real-time trades every 1.5 - 2.5 seconds
    const interval = setInterval(() => {
      const newTrades = generateRecentTrades(symbol, 2);
      setTrades((prev) => [...newTrades, ...prev.slice(0, 22)]);
    }, 1800);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="flex flex-col h-full bg-[#181A20] select-none text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2B313A] text-xs">
        <span className="font-bold text-[#EAECEF]">Recent Market Trades</span>
        <span className="text-[10px] text-bull bg-bull-dim px-1.5 py-0.2 rounded font-mono">Live Feed</span>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 px-3 py-1 text-[10px] text-[#848E9C] font-semibold border-b border-[#23272E]">
        <div className="text-left">Price (USDT)</div>
        <div className="text-right">Size</div>
        <div className="text-right">Time</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] divide-y divide-[#1E2329]">
        {trades.map((trade) => {
          const isBuy = trade.side === "buy";
          return (
            <div
              key={trade.id}
              className={`grid grid-cols-3 px-3 py-1 hover:bg-[#23272E] tabular-nums transition-colors ${
                isBuy ? "hover:bg-bull-dim" : "hover:bg-bear-dim"
              }`}
            >
              <span className={`font-mono font-medium text-left ${isBuy ? "text-bull" : "text-bear"}`}>
                {trade.price.toFixed(2)}
              </span>
              <span className="text-[#EAECEF] font-mono text-right">
                {formatNumber(trade.amount, 3)}
              </span>
              <span className="text-[#848E9C] font-mono text-[10px] text-right">
                {formatTimestamp(trade.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
