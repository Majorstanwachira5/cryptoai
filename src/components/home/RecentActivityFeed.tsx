"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { LedgerTransaction } from "@/types/ledger";
import { formatCurrency, formatTimestamp, formatDate } from "@/lib/utils";
import { Activity, ArrowUpRight, ArrowDownLeft, Zap, RefreshCw, Award, ShieldAlert } from "lucide-react";

export default function RecentActivityFeed() {
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      setLedger([...state.ledger]);
    };
    update();
    return store.subscribe(update);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "faucet_deposit":
      case "deposit":
        return <Zap className="w-4 h-4 text-[#F0B90B]" />;
      case "internal_transfer_sent":
        return <ArrowUpRight className="w-4 h-4 text-bear" />;
      case "internal_transfer_received":
        return <ArrowDownLeft className="w-4 h-4 text-bull" />;
      case "referral_bonus":
        return <Award className="w-4 h-4 text-[#F0B90B]" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card select-none mt-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#2B313A]">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#F0B90B]" />
          <h3 className="font-extrabold text-sm text-white">Recent Ledger & Platform Activity</h3>
        </div>
        <span className="text-[10px] text-[#848E9C]">Real-time audit synchronized</span>
      </div>

      <div className="divide-y divide-[#1E2329] mt-2 max-h-72 overflow-y-auto">
        {ledger.map((item) => (
          <div key={item.id} className="py-2.5 flex items-center justify-between hover:bg-[#1E2329] px-2 rounded transition-colors text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded bg-[#0B0E11] border border-[#2B313A] flex items-center justify-center">
                {getIcon(item.type)}
              </div>
              <div>
                <div className="font-semibold text-white capitalize">{item.description}</div>
                <div className="text-[10px] text-[#848E9C] flex items-center space-x-2 mt-0.5">
                  <span>{formatDate(item.timestamp)} {formatTimestamp(item.timestamp)}</span>
                  <span>·</span>
                  <span className="font-mono text-[9px] text-[#5E6673]">{item.txHash.slice(0, 16)}...</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`font-mono font-bold text-xs tabular-nums ${
                  item.type.includes("deposit") || item.type.includes("received") || item.type.includes("bonus")
                    ? "text-bull"
                    : "text-bear"
                }`}
              >
                {item.type.includes("sent") || item.type.includes("withdrawal") ? "-" : "+"}
                {formatCurrency(item.amount, 2, "")} {item.asset}
              </div>
              <div className="text-[10px] text-[#0ECB81] uppercase font-bold tracking-wider mt-0.5">
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
