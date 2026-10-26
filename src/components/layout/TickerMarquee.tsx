"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getInitialTickers } from "@/lib/marketData";
import { MarketTicker } from "@/types/market";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TickerMarquee() {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);

  useEffect(() => {
    setTickers(getInitialTickers());

    // Subtle tick micro-fluctuation every 3.5 seconds
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.49) * (t.price * 0.0008);
          const newPrice = Number((t.price + delta).toFixed(2));
          return {
            ...t,
            price: newPrice,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0B0E11] border-b border-[#23272E] px-4 py-1.5 overflow-x-auto scrollbar-none flex items-center space-x-6 text-[11px] select-none">
      <div className="flex items-center space-x-1.5 text-[#848E9C] font-semibold shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider text-[#B7BDC6]">Markets 24h:</span>
      </div>

      <div className="flex items-center space-x-6 shrink-0">
        {tickers.map((t) => {
          const isUp = t.changePercent24h >= 0;
          return (
            <Link
              key={t.symbol}
              href={`/trade?pair=${t.symbol}`}
              className="flex items-center space-x-2 hover:bg-[#181A20] px-2 py-0.5 rounded transition-colors group"
            >
              <span className="font-bold text-[#EAECEF] group-hover:text-[#F0B90B] transition-colors">
                {t.baseAsset}/{t.quoteAsset}
              </span>
              <span className="font-mono tabular-nums text-white">
                {formatCurrency(t.price, t.price < 1 ? 4 : 2, "")}
              </span>
              <span
                className={`flex items-center font-mono tabular-nums text-[10px] font-medium ${
                  isUp ? "text-bull" : "text-bear"
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                )}
                {formatPercent(t.changePercent24h)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
