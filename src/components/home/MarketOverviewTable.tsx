"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getInitialTickers } from "@/lib/marketData";
import { MarketTicker } from "@/types/market";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Search, ArrowUpRight, ArrowDownRight, TrendingUp, Star } from "lucide-react";

export default function MarketOverviewTable() {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [activeTab, setActiveTab] = useState<"hot" | "gainers" | "losers" | "volume">("hot");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["BTCUSDT", "ETHUSDT"]));

  useEffect(() => {
    setTickers(getInitialTickers());

    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.49) * (t.price * 0.0006);
          return {
            ...t,
            price: Number((t.price + delta).toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(favorites);
    if (next.has(symbol)) next.delete(symbol);
    else next.add(symbol);
    setFavorites(next);
  };

  let displayed = tickers.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.baseAsset.toLowerCase().includes(search.toLowerCase())
  );

  if (activeTab === "gainers") {
    displayed = [...displayed].sort((a, b) => b.changePercent24h - a.changePercent24h);
  } else if (activeTab === "losers") {
    displayed = [...displayed].sort((a, b) => a.changePercent24h - b.changePercent24h);
  } else if (activeTab === "volume") {
    displayed = [...displayed].sort((a, b) => b.quoteVolume24h - a.quoteVolume24h);
  }

  return (
    <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card select-none">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2B313A]">
        {/* Tabs */}
        <div className="flex items-center space-x-2">
          {[
            { key: "hot", label: "🔥 Hot Markets" },
            { key: "gainers", label: "🚀 Top Gainers" },
            { key: "losers", label: "🔻 Top Losers" },
            { key: "volume", label: "📊 24h Volume" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === tab.key
                  ? "bg-[#2B313A] text-[#F0B90B]"
                  : "text-[#848E9C] hover:text-white hover:bg-[#1E2329]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#848E9C]" />
          <input
            type="text"
            placeholder="Search coin/pair..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0E11] border border-[#2B313A] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#5E6673] focus:outline-none focus:border-[#F0B90B]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs tabular-nums">
          <thead>
            <tr className="text-[#848E9C] border-b border-[#23272E] text-[11px] font-semibold">
              <th className="py-2.5 pl-2">Market Pair</th>
              <th className="py-2.5 text-right">Last Price</th>
              <th className="py-2.5 text-right">24h Change</th>
              <th className="py-2.5 text-right hidden sm:table-cell">24h High</th>
              <th className="py-2.5 text-right hidden sm:table-cell">24h Low</th>
              <th className="py-2.5 text-right hidden md:table-cell">24h Volume (USDT)</th>
              <th className="py-2.5 text-center hidden lg:table-cell">7d Trend</th>
              <th className="py-2.5 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2329]">
            {displayed.map((ticker) => {
              const isUp = ticker.changePercent24h >= 0;
              const isFav = favorites.has(ticker.symbol);

              return (
                <tr key={ticker.symbol} className="hover:bg-[#1E2329] transition-colors group">
                  <td className="py-3 pl-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => toggleFavorite(ticker.symbol, e)}
                        className="text-[#5E6673] hover:text-[#F0B90B] transition-colors"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isFav ? "fill-[#F0B90B] text-[#F0B90B]" : "text-[#5E6673]"
                          }`}
                        />
                      </button>
                      <Link href={`/trade?pair=${ticker.symbol}`} className="flex items-baseline space-x-1">
                        <span className="font-extrabold text-white text-xs group-hover:text-[#F0B90B] transition-colors">
                          {ticker.baseAsset}
                        </span>
                        <span className="text-[10px] text-[#848E9C]">/{ticker.quoteAsset}</span>
                      </Link>
                    </div>
                  </td>

                  <td className="py-3 text-right font-mono font-bold text-white text-xs">
                    {formatCurrency(ticker.price, ticker.price < 1 ? 4 : 2, "$")}
                  </td>

                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center font-mono font-bold text-xs ${
                        isUp ? "text-bull" : "text-bear"
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
                      )}
                      {formatPercent(ticker.changePercent24h)}
                    </span>
                  </td>

                  <td className="py-3 text-right font-mono text-[#848E9C] hidden sm:table-cell">
                    {formatCurrency(ticker.high24h, ticker.price < 1 ? 4 : 2, "$")}
                  </td>

                  <td className="py-3 text-right font-mono text-[#848E9C] hidden sm:table-cell">
                    {formatCurrency(ticker.low24h, ticker.price < 1 ? 4 : 2, "$")}
                  </td>

                  <td className="py-3 text-right font-mono text-[#848E9C] hidden md:table-cell">
                    {formatCurrency(ticker.quoteVolume24h, 0, "$")}
                  </td>

                  {/* Sparkline Visual */}
                  <td className="py-3 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center space-x-0.5 h-4">
                      {ticker.sparkline.slice(-10).map((val, i) => {
                        const h = 4 + (Math.abs(val) % 12);
                        return (
                          <div
                            key={i}
                            className={`w-1 rounded-sm ${isUp ? "bg-bull/70" : "bg-bear/70"}`}
                            style={{ height: `${h}px` }}
                          />
                        );
                      })}
                    </div>
                  </td>

                  <td className="py-3 text-right pr-2">
                    <Link
                      href={`/trade?pair=${ticker.symbol}`}
                      className="px-3 py-1 rounded bg-[#2B313A] hover:bg-bull hover:text-black text-white text-xs font-bold transition-all inline-block"
                    >
                      Trade
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
