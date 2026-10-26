"use client";

import React from "react";
import P2PMarketplace from "@/components/p2p/P2PMarketplace";
import { ShieldCheck, UserCheck, Lock, Coins } from "lucide-react";

export default function P2PPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* P2P Header Banner */}
      <div className="bg-[#181A20] p-4 rounded border border-[#2B313A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-[#F0B90B]/20 border border-[#F0B90B]/40 flex items-center justify-center text-[#F0B90B]">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white">Peer-to-Peer (P2P) Crypto Marketplace</h1>
              <span className="text-[10px] bg-bull-dim text-bull px-2 py-0.5 rounded font-mono font-bold">
                Smart Escrow Protected
              </span>
            </div>
            <p className="text-[11px] text-[#848E9C] mt-0.5">
              Buy and sell synthetic USDT directly with verified local advertisers via bank transfer, Revolut, Wise, and mobile money.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-[#848E9C]">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-bull" />
            <span>0% Trading Fee</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#F0B90B]" />
            <span>100% KYC Verified Advertisers</span>
          </div>
        </div>
      </div>

      {/* Main P2P Marketplace Component */}
      <P2PMarketplace />
    </div>
  );
}
