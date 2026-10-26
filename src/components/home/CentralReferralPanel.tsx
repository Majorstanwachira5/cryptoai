"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { ReferralStats } from "@/types/referral";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Copy, Check, Share2, Award, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CentralReferralPanel() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      setStats({ ...state.referralStats });
    };
    update();
    return store.subscribe(update);
  }, []);

  if (!stats) return null;

  const copyToClipboard = (text: string, type: "code" | "link") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#181A20] via-[#1E2329] to-[#181A20] rounded border border-[#F0B90B]/30 p-5 shadow-card select-none my-6 relative overflow-hidden">
      {/* Subtle gold glow banner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-[#F0B90B]/20 border border-[#F0B90B]/40 flex items-center justify-center text-[#F0B90B]">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-white">Central Affiliate & Referral Program</h2>
              <span className="text-[10px] bg-[#F0B90B]/20 text-[#F0B90B] font-mono px-2 py-0.5 rounded font-bold border border-[#F0B90B]/30">
                {stats.currentTier.name} ({(stats.currentTier.commissionRate * 100).toFixed(0)}% Commission)
              </span>
            </div>
            <p className="text-xs text-[#848E9C] mt-0.5">
              Invite friends to paper trade or backtest and earn up to 35% synthetic trading fee rewards.
            </p>
          </div>
        </div>

        <Link
          href="/referrals"
          className="flex items-center space-x-1.5 text-xs font-bold text-[#F0B90B] hover:text-white transition-colors"
        >
          <span>View Detailed Affiliate Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[11px] text-[#848E9C] font-semibold">Total Referrals</div>
          <div className="text-xl font-extrabold text-white font-mono mt-1 tabular-nums">
            {stats.totalReferrals} <span className="text-xs text-[#848E9C] font-normal">Traders</span>
          </div>
          <div className="text-[10px] text-bull mt-0.5 font-semibold">
            {stats.eligibleReferrals} Active & Qualified
          </div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[11px] text-[#848E9C] font-semibold">Total Earned Commission</div>
          <div className="text-xl font-extrabold text-[#F0B90B] font-mono mt-1 tabular-nums">
            {formatCurrency(stats.totalCommissionUSDT)}
          </div>
          <div className="text-[10px] text-[#848E9C] mt-0.5">Lifetime settled</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[11px] text-[#848E9C] font-semibold">Pending Rewards</div>
          <div className="text-xl font-extrabold text-white font-mono mt-1 tabular-nums">
            {formatCurrency(stats.pendingCommissionUSDT)}
          </div>
          <div className="text-[10px] text-yellow-400 mt-0.5">Clearing next cycle</div>
        </div>

        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
          <div className="text-[11px] text-[#848E9C] font-semibold">Confirmed & Withdrawn</div>
          <div className="text-xl font-extrabold text-bull font-mono mt-1 tabular-nums">
            {formatCurrency(stats.confirmedCommissionUSDT)}
          </div>
          <div className="text-[10px] text-bull mt-0.5">Credited to USDT Ledger</div>
        </div>
      </div>

      {/* Referral Code & Share Link Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Referral Code Box */}
        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#848E9C] block font-semibold uppercase">Your Referral Code</span>
            <span className="text-sm font-extrabold text-[#F0B90B] font-mono tracking-wider">{stats.referralCode}</span>
          </div>
          <button
            onClick={() => copyToClipboard(stats.referralCode, "code")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#1E2329] hover:bg-[#2B313A] text-xs font-semibold text-white transition-colors border border-[#2B313A]"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-bull" /> : <Copy className="w-3.5 h-3.5 text-[#848E9C]" />}
            <span>{copiedCode ? "Copied" : "Copy Code"}</span>
          </button>
        </div>

        {/* Referral Link Box */}
        <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A] flex items-center justify-between">
          <div className="truncate mr-2">
            <span className="text-[10px] text-[#848E9C] block font-semibold uppercase">Your Invitation Link</span>
            <span className="text-xs font-mono text-white truncate block">{stats.referralLink}</span>
          </div>
          <button
            onClick={() => copyToClipboard(stats.referralLink, "link")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#F0B90B] hover:bg-gold-hover text-black text-xs font-bold transition-colors shrink-0"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
