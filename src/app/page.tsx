"use client";

import React from "react";
import PortfolioOverview from "@/components/home/PortfolioOverview";
import CentralReferralPanel from "@/components/home/CentralReferralPanel";
import MarketOverviewTable from "@/components/home/MarketOverviewTable";
import RecentActivityFeed from "@/components/home/RecentActivityFeed";
import Link from "next/link";
import { TrendingUp, Cpu, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Portfolio Overview */}
      <PortfolioOverview />

      {/* Central Referral Panel - Prominently positioned between portfolio and markets */}
      <CentralReferralPanel />

      {/* Market Overview Table */}
      <MarketOverviewTable />

      {/* Recent Activity Feed */}
      <RecentActivityFeed />
    </div>
  );
}
