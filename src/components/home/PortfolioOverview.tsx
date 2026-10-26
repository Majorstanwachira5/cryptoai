"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Zap, ArrowLeftRight, TrendingUp } from "lucide-react";

export default function PortfolioOverview() {
  const [hideBalances, setHideBalances] = useState(false);
  const [totalUsd, setTotalUsd] = useState(57658.41);
  const [availableUsdt, setAvailableUsdt] = useState(15420.50);
  const [reservedUsdt, setReservedUsdt] = useState(1250.00);
  const [dailyPnL, setDailyPnL] = useState(1083.40);
  const [dailyPnLPercent, setDailyPnLPercent] = useState(1.92);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      const usdt = state.balances["USDT"];
      const btc = state.balances["BTC"];
      const eth = state.balances["ETH"];
      const sol = state.balances["SOL"];
      const bnb = state.balances["BNB"];

      const totalVal =
        (usdt?.total || 0) +
        (btc?.total || 0) * 67850.50 +
        (eth?.total || 0) * 3480.20 +
        (sol?.total || 0) * 178.60 +
        (bnb?.total || 0) * 592.40;

      setTotalUsd(totalVal);
      setAvailableUsdt(usdt?.free || 0);
      setReservedUsdt(usdt?.locked || 0);
    };
    update();
    return store.subscribe(update);
  }, []);

  return (
    <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
        {/* Left: Balance figures */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#848E9C]">
            <Wallet className="w-4 h-4 text-[#F0B90B]" />
            <span className="font-semibold uppercase tracking-wider">Simulated Portfolio Valuation</span>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="text-[#848E9C] hover:text-[#EAECEF] transition-colors"
            >
              {hideBalances ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] bg-bull-dim text-bull px-1.5 py-0.5 rounded font-mono font-bold">Paper Active</span>
          </div>

          <div className="flex items-baseline space-x-3 mt-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {hideBalances ? "••••••••••" : formatCurrency(totalUsd, 2)}
            </span>
            <span className="text-xs font-mono text-[#848E9C]">
              ≈ {hideBalances ? "••••" : formatNumber(totalUsd / 67850.50, 4)} BTC
            </span>
          </div>

          <div className="flex items-center space-x-4 mt-2 text-xs">
            <div className="flex items-center space-x-1 text-bull font-mono font-semibold tabular-nums">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{hideBalances ? "••••" : `+${formatCurrency(dailyPnL, 2)}`} ({formatPercent(dailyPnLPercent)}) 24h</span>
            </div>
            <div className="text-[#848E9C]">
              Available USDT: <span className="text-white font-mono font-semibold">{hideBalances ? "••••" : formatCurrency(availableUsdt)}</span>
            </div>
            <div className="text-[#848E9C]">
              In Orders: <span className="text-[#F0B90B] font-mono font-semibold">{hideBalances ? "••••" : formatCurrency(reservedUsdt)}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => store.claimFaucet(5000)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded bg-[#2B313A] hover:bg-[#363D47] text-[#F0B90B] text-xs font-bold transition-all border border-[#474D57]"
          >
            <Zap className="w-3.5 h-3.5 fill-[#F0B90B]" />
            <span>Deposit Faucet</span>
          </button>
          <Link
            href="/wallet"
            className="flex items-center space-x-1.5 px-3 py-2 rounded bg-[#1E2329] hover:bg-[#2B313A] text-white text-xs font-semibold transition-all border border-[#2B313A]"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Transfer</span>
          </Link>
          <Link
            href="/trade"
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-bull hover:bg-bull-hover text-black text-xs font-extrabold transition-all shadow-md"
          >
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Spot Trade</span>
          </Link>
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="mt-4 pt-1">
        <div className="flex items-center justify-between text-[11px] text-[#848E9C] mb-1.5 font-semibold">
          <span>Asset Allocation</span>
          <span>USDT 28.9% · BTC 47.6% · ETH 13.0% · SOL 5.2% · BNB 5.3%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#0B0E11]">
          <div className="bg-[#F0B90B] h-full" style={{ width: "47.6%" }} title="Bitcoin" />
          <div className="bg-bull h-full" style={{ width: "28.9%" }} title="USDT" />
          <div className="bg-blue-500 h-full" style={{ width: "13.0%" }} title="Ethereum" />
          <div className="bg-purple-500 h-full" style={{ width: "5.2%" }} title="Solana" />
          <div className="bg-yellow-600 h-full" style={{ width: "5.3%" }} title="BNB" />
        </div>
      </div>
    </div>
  );
}
