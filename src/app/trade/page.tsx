"use client";

import React, { useState, useEffect } from "react";
import PairHeader from "@/components/trading/PairHeader";
import TradingChart from "@/components/trading/TradingChart";
import OrderBook from "@/components/trading/OrderBook";
import RecentTrades from "@/components/trading/RecentTrades";
import OrderForm from "@/components/trading/OrderForm";
import OrdersAndPositions from "@/components/trading/OrdersAndPositions";
import { getCurrentPrice } from "@/lib/marketData";

export default function TradePage() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [currentPrice, setCurrentPrice] = useState(67850.50);

  useEffect(() => {
    setCurrentPrice(getCurrentPrice(symbol));

    // Live micro-tick updates
    const interval = setInterval(() => {
      const p = getCurrentPrice(symbol);
      const delta = (Math.random() - 0.49) * (p * 0.0004);
      setCurrentPrice(Number((p + delta).toFixed(2)));
    }, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  const handlePriceClick = (price: number) => {
    setCurrentPrice(price);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-[#0B0E11] select-none">
      {/* 1. Pair Header */}
      <PairHeader
        currentSymbol={symbol}
        onSelectSymbol={(s) => setSymbol(s)}
      />

      {/* 2. Main Trading Grid Layout (Dense Binance Pro arrangement) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left & Center: Chart & Bottom Dock (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#2B313A]">
          {/* Main Chart */}
          <div className="h-[440px] w-full">
            <TradingChart symbol={symbol} currentPrice={currentPrice} />
          </div>

          {/* Orders, Positions & History Dock */}
          <div className="flex-1 min-h-[260px]">
            <OrdersAndPositions />
          </div>
        </div>

        {/* Right Area: Order Book & Order Form (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col bg-[#181A20]">
          {/* Upper Right: Order Book & Recent Trades Split Tabs / Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 h-[440px] border-b border-[#2B313A]">
            <OrderBook symbol={symbol} onPriceClick={handlePriceClick} />
            <div className="hidden sm:block lg:hidden xl:block">
              <RecentTrades symbol={symbol} />
            </div>
          </div>

          {/* Lower Right: Buy & Sell Order Form */}
          <div className="flex-1 min-h-[300px]">
            <OrderForm symbol={symbol} externalPrice={currentPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
