"use client";

import React, { useState } from "react";
import { SUPPORTED_PAIRS } from "@/lib/marketData";
import { MarketTicker } from "@/types/market";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
import { ChevronDown, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PairHeaderProps {
  currentSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  ticker?: MarketTicker;
}

export default function PairHeader({ currentSymbol, onSelectSymbol, ticker }: PairHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedPair = SUPPORTED_PAIRS.find((p) => p.symbol === currentSymbol) || SUPPORTED_PAIRS[0];
  const price = ticker?.price || selectedPair.defaultPrice;
  const changePercent = ticker?.changePercent24h || 3.42;
  const isUp = changePercent >= 0;

  const filteredPairs = SUPPORTED_PAIRS.filter(
    (p) =>
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.baseAsset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#181A20] border-b border-[#2B313A] px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-xs select-none">
      {/* Pair Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 bg-[#1E2329] hover:bg-[#2B313A] px-3 py-1.5 rounded transition-colors border border-[#2B313A]"
        >
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-white text-sm tracking-wide">{selectedPair.displayName}</span>
            <span className="text-[10px] bg-[#2B313A] text-bull px-1 py-0.2 rounded font-mono font-semibold">Spot</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#848E9C]" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#1E2329] border border-[#2B313A] rounded shadow-dropdown p-2 z-50">
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-[#848E9C]" />
              <input
                type="text"
                placeholder="Search market..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#181A20] border border-[#2B313A] rounded pl-7 pr-2 py-1 text-xs text-white placeholder-[#5E6673] focus:outline-none focus:border-[#F0B90B]"
                autoFocus
              />
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1">
              {filteredPairs.map((p) => (
                <button
                  key={p.symbol}
                  onClick={() => {
                    onSelectSymbol(p.symbol);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                    p.symbol === currentSymbol ? "bg-[#2B313A] text-[#F0B90B]" : "hover:bg-[#181A20] text-[#EAECEF]"
                  }`}
                >
                  <span className="font-bold text-xs">{p.displayName}</span>
                  <span className="font-mono text-xs tabular-nums text-[#848E9C]">
                    {formatCurrency(p.defaultPrice, p.defaultPrice < 1 ? 4 : 2, "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Ticker Metrics */}
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <div className="text-[10px] text-[#848E9C] font-semibold">Last Price</div>
          <div className={`font-mono text-base font-extrabold tabular-nums ${isUp ? "text-bull" : "text-bear"}`}>
            {formatCurrency(price, selectedPair.precision, "$")}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#848E9C] font-semibold">24h Change</div>
          <div className={`flex items-center font-mono font-bold text-xs tabular-nums ${isUp ? "text-bull" : "text-bear"}`}>
            {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />}
            {formatPercent(changePercent)}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#848E9C] font-semibold">24h High</div>
          <div className="font-mono text-xs text-[#EAECEF] tabular-nums">
            {formatCurrency(ticker?.high24h || price * 1.035, selectedPair.precision, "$")}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#848E9C] font-semibold">24h Low</div>
          <div className="font-mono text-xs text-[#EAECEF] tabular-nums">
            {formatCurrency(ticker?.low24h || price * 0.965, selectedPair.precision, "$")}
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="text-[10px] text-[#848E9C] font-semibold">24h Volume ({selectedPair.baseAsset})</div>
          <div className="font-mono text-xs text-[#EAECEF] tabular-nums">
            {formatNumber(ticker?.volume24h || 24150.8, 2)}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="text-[10px] text-[#848E9C] font-semibold">24h Volume (USDT)</div>
          <div className="font-mono text-xs text-[#EAECEF] tabular-nums">
            {formatCurrency(ticker?.quoteVolume24h || 1642850000, 0, "$")}
          </div>
        </div>
      </div>
    </div>
  );
}
