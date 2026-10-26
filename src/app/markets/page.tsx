"use client";

import React from "react";
import MarketOverviewTable from "@/components/home/MarketOverviewTable";
import { BarChart2, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";

export default function MarketsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 select-none">
      <div className="bg-[#181A20] p-4 rounded border border-[#2B313A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#F0B90B] flex items-center justify-center text-black font-extrabold text-sm">
            <BarChart2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white">Cryptocurrency Markets Screener</h1>
            <p className="text-[11px] text-[#848E9C]">
              Real-time spot price discovery, 24h trading volume, and liquidity depth across primary trading pairs.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-bull animate-pulse" />
          <span className="text-bull font-mono font-bold">Public Exchange Feed Synchronized</span>
        </div>
      </div>

      <MarketOverviewTable />
    </div>
  );
}
