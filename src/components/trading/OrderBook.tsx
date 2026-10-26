"use client";

import React, { useState, useEffect } from "react";
import { generateOrderBook } from "@/lib/marketData";
import { OrderBook as IOrderBook } from "@/types/market";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OrderBookProps {
  symbol: string;
  onPriceClick?: (price: number) => void;
}

export default function OrderBook({ symbol, onPriceClick }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<IOrderBook | null>(null);
  const [precision, setPrecision] = useState<number>(2);

  useEffect(() => {
    setOrderBook(generateOrderBook(symbol, 12));

    // Real-time micro-updates every 1.2 seconds
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(symbol, 12));
    }, 1200);

    return () => clearInterval(interval);
  }, [symbol]);

  if (!orderBook) return null;

  const maxAskTotal = orderBook.asks[orderBook.asks.length - 1]?.total || 10;
  const maxBidTotal = orderBook.bids[orderBook.bids.length - 1]?.total || 10;

  // Top asks rendered reversed (highest ask on top, lowest ask right above spread)
  const displayAsks = [...orderBook.asks].reverse();

  return (
    <div className="flex flex-col h-full bg-[#181A20] border-r border-[#2B313A] select-none text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2B313A] text-xs">
        <span className="font-bold text-[#EAECEF]">Order Book</span>
        <div className="flex items-center space-x-1">
          {[0.01, 0.1, 1].map((p) => (
            <button
              key={p}
              onClick={() => setPrecision(p === 0.01 ? 2 : p === 0.1 ? 1 : 0)}
              className="text-[10px] px-1 py-0.5 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 px-3 py-1 text-[10px] text-[#848E9C] font-semibold border-b border-[#23272E]">
        <div className="text-left">Price (USDT)</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sells - Red) */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden py-0.5">
        {displayAsks.map((ask, idx) => {
          const depthPercent = Math.min(100, (ask.total / maxAskTotal) * 100);
          return (
            <div
              key={`ask_${idx}`}
              onClick={() => onPriceClick?.(ask.price)}
              className="relative grid grid-cols-3 px-3 py-0.5 hover:bg-[#23272E] cursor-pointer tabular-nums"
            >
              <div
                className="depth-bar-ask"
                style={{ width: `${depthPercent}%` }}
              />
              <span className="text-bear font-mono font-medium z-10 text-left">
                {ask.price.toFixed(precision)}
              </span>
              <span className="text-[#EAECEF] font-mono z-10 text-right">
                {formatNumber(ask.amount, 3)}
              </span>
              <span className="text-[#848E9C] font-mono z-10 text-right">
                {formatNumber(ask.total, 3)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Center Spread & Last Price Bar */}
      <div className="px-3 py-2 my-0.5 bg-[#0B0E11] border-y border-[#2B313A] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="font-mono text-sm font-extrabold text-bull tabular-nums">
            {orderBook.lastPrice.toFixed(precision)}
          </span>
          <ArrowUp className="w-3.5 h-3.5 text-bull stroke-[3]" />
        </div>
        <div className="text-[10px] text-[#848E9C] font-mono tabular-nums">
          Spread: {orderBook.spread.toFixed(precision)} ({orderBook.spreadPercent}%)
        </div>
      </div>

      {/* Bids (Buys - Green) */}
      <div className="flex-1 overflow-hidden py-0.5">
        {orderBook.bids.map((bid, idx) => {
          const depthPercent = Math.min(100, (bid.total / maxBidTotal) * 100);
          return (
            <div
              key={`bid_${idx}`}
              onClick={() => onPriceClick?.(bid.price)}
              className="relative grid grid-cols-3 px-3 py-0.5 hover:bg-[#23272E] cursor-pointer tabular-nums"
            >
              <div
                className="depth-bar-bid"
                style={{ width: `${depthPercent}%` }}
              />
              <span className="text-bull font-mono font-medium z-10 text-left">
                {bid.price.toFixed(precision)}
              </span>
              <span className="text-[#EAECEF] font-mono z-10 text-right">
                {formatNumber(bid.amount, 3)}
              </span>
              <span className="text-[#848E9C] font-mono z-10 text-right">
                {formatNumber(bid.total, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
