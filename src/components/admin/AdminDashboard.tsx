"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { formatCurrency, formatDate, formatTimestamp } from "@/lib/utils";
import {
  ShieldAlert,
  Users,
  Activity,
  Server,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "disputes" | "audit">("overview");
  const [metrics, setMetrics] = useState({
    totalVolumeUSDT: 48950240.00,
    activeUsers: 3418,
    openDisputes: 2,
    totalReserveUSDT: 1250000.00,
  });

  const [users, setUsers] = useState([
    { id: "u_1", uid: "88291045", username: "BullTrader_Pro", email: "trader@cryptobull.ai", role: "Admin", kyc: "Tier 2", frozen: false, balance: 16670.50 },
    { id: "u_2", uid: "88299102", username: "CryptoWhale_88", email: "whale@crypto.com", role: "Trader", kyc: "Tier 2", frozen: false, balance: 94820.00 },
    { id: "u_3", uid: "88294419", username: "SatoshiDream", email: "sat@dream.io", role: "Trader", kyc: "Tier 1", frozen: true, balance: 2450.00 },
    { id: "u_4", uid: "88290312", username: "AlphaTraderX", email: "alpha@quant.net", role: "Trader", kyc: "Tier 3", frozen: false, balance: 145000.00 },
  ]);

  const [disputes, setDisputes] = useState([
    { id: "disp_1", orderNumber: "P2P-849102", buyer: "CryptoWhale_88", seller: "SwiftCrypto_OTC", amount: 1200.00, fiat: "1,204.80 USD", reason: "Payment sent via wire but seller offline", status: "PENDING_REVIEW" },
    { id: "disp_2", orderNumber: "P2P-339108", buyer: "TraderAlpha", seller: "EuroBridge_Direct", amount: 500.00, fiat: "462.50 EUR", reason: "Reference code mismatch on SEPA bank receipt", status: "ARBITRATION" },
  ]);

  const toggleFreeze = (uid: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, frozen: !u.frozen } : u))
    );
  };

  const resolveDispute = (id: string, resolution: "release_to_buyer" | "refund_to_seller") => {
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    setMetrics((prev) => ({ ...prev, openDisputes: Math.max(0, prev.openDisputes - 1) }));
  };

  return (
    <div className="space-y-6 select-none text-xs">
      {/* Admin Command Header */}
      <div className="bg-[#181A20] p-4 rounded border border-[#2B313A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-[#F0B90B] flex items-center justify-center text-black font-extrabold text-sm shadow-md">
            ADM
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-white">Platform Administration Command Center</h2>
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-mono font-bold">
                Master Authority
              </span>
            </div>
            <p className="text-[11px] text-[#848E9C] mt-0.5">
              Supervise simulated exchange matching, P2P dispute arbitration, and double-entry ledger audits.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-bull animate-pulse" />
          <span className="text-[#0ECB81] font-mono font-bold text-xs">Cluster: Healthy (Port 3300)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A]">
          <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Simulated 24h Volume</span>
          <div className="text-xl font-extrabold text-white font-mono mt-1 tabular-nums">
            {formatCurrency(metrics.totalVolumeUSDT)}
          </div>
          <div className="text-[10px] text-bull mt-1 font-semibold">+14.2% vs previous period</div>
        </div>

        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A]">
          <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Active Registered Traders</span>
          <div className="text-xl font-extrabold text-white font-mono mt-1 tabular-nums">
            {metrics.activeUsers}
          </div>
          <div className="text-[10px] text-[#848E9C] mt-1">100% paper trading mode</div>
        </div>

        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A]">
          <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Open P2P Disputes</span>
          <div className="text-xl font-extrabold text-yellow-400 font-mono mt-1 tabular-nums">
            {metrics.openDisputes} Pending
          </div>
          <div className="text-[10px] text-[#848E9C] mt-1">Requires arbitrator review</div>
        </div>

        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A]">
          <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Escrow Reserve Vault</span>
          <div className="text-xl font-extrabold text-[#F0B90B] font-mono mt-1 tabular-nums">
            {formatCurrency(metrics.totalReserveUSDT)}
          </div>
          <div className="text-[10px] text-[#848E9C] mt-1">1:1 Backed simulated USDT</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#2B313A]">
          {[
            { key: "users", label: `User Management (${users.length})` },
            { key: "disputes", label: `P2P Disputes (${disputes.length})` },
            { key: "audit", label: "Ledger Audit & System Health" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === t.key
                  ? "bg-[#2B313A] text-[#F0B90B]"
                  : "text-[#848E9C] hover:text-white hover:bg-[#1E2329]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Users Management */}
        {activeTab === "users" && (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs tabular-nums">
              <thead>
                <tr className="text-[#848E9C] border-b border-[#23272E] text-[11px] font-semibold">
                  <th className="py-2 pl-2">UID / User</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">KYC Status</th>
                  <th className="py-2 text-right">Synthetic Balance</th>
                  <th className="py-2 text-center">Account State</th>
                  <th className="py-2 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2329]">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-[#1E2329]">
                    <td className="py-3 pl-2">
                      <div className="font-bold text-white text-xs">{u.username}</div>
                      <div className="text-[10px] text-[#848E9C]">UID: {u.uid} · {u.email}</div>
                    </td>
                    <td className="py-3 font-semibold text-white">{u.role}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-bull-dim text-bull font-bold">
                        {u.kyc}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {formatCurrency(u.balance)}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.frozen ? "bg-bear-dim text-bear" : "bg-bull-dim text-bull"
                        }`}
                      >
                        {u.frozen ? "FROZEN" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => toggleFreeze(u.uid)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          u.frozen
                            ? "bg-bull hover:bg-bull-hover text-black"
                            : "bg-[#2B313A] hover:bg-bear text-white"
                        }`}
                      >
                        {u.frozen ? "Unfreeze" : "Freeze"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* P2P Disputes Resolution */}
        {activeTab === "disputes" && (
          <div className="space-y-3 mt-3">
            {disputes.length === 0 ? (
              <div className="text-center py-8 text-[#5E6673]">No pending P2P disputes</div>
            ) : (
              disputes.map((d) => (
                <div key={d.id} className="bg-[#0B0E11] p-4 rounded border border-[#2B313A] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{d.orderNumber}</span>
                      <span className="text-[10px] bg-yellow-950 text-yellow-400 border border-yellow-800 px-2 py-0.5 rounded font-mono font-bold">
                        {d.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#848E9C] mt-1">
                      Buyer: <strong className="text-white">{d.buyer}</strong> · Seller: <strong className="text-white">{d.seller}</strong> · Value: <strong className="text-[#F0B90B] font-mono">{d.amount} USDT ({d.fiat})</strong>
                    </div>
                    <div className="text-[11px] text-[#EAECEF] mt-1 italic">
                      Claim: "{d.reason}"
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => resolveDispute(d.id, "release_to_buyer")}
                      className="px-3 py-1.5 rounded bg-bull hover:bg-bull-hover text-black font-bold text-xs"
                    >
                      Arbitrate: Release to Buyer
                    </button>
                    <button
                      onClick={() => resolveDispute(d.id, "refund_to_seller")}
                      className="px-3 py-1.5 rounded bg-[#2B313A] hover:bg-[#363D47] text-white font-semibold text-xs"
                    >
                      Refund to Seller
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Audit & Health */}
        {activeTab === "audit" && (
          <div className="space-y-4 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
                <div className="text-[10px] text-[#848E9C] font-semibold">Web Server Process</div>
                <div className="text-xs font-bold text-bull mt-1">Next.js 14 App Router (Port 3300)</div>
                <div className="text-[10px] text-[#5E6673] mt-0.5">Uptime: 99.99%</div>
              </div>

              <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
                <div className="text-[10px] text-[#848E9C] font-semibold">Database Engine</div>
                <div className="text-xs font-bold text-blue-400 mt-1">PostgreSQL 15 / Prisma (Port 5433)</div>
                <div className="text-[10px] text-[#5E6673] mt-0.5">Safe port isolation configured</div>
              </div>

              <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
                <div className="text-[10px] text-[#848E9C] font-semibold">Redis Message Bus</div>
                <div className="text-xs font-bold text-[#F0B90B] mt-1">Redis 7 Alpine (Port 6381)</div>
                <div className="text-[10px] text-[#5E6673] mt-0.5">0 Port collisions on host</div>
              </div>
            </div>

            <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A] text-[11px] text-[#848E9C] space-y-1">
              <div className="font-bold text-white">System Security Checklist:</div>
              <div>✓ Public market data rate limit protection active</div>
              <div>✓ Double-entry synthetic ledger transactions cryptographically hashed</div>
              <div>✓ Instant paper order matching executed with 0 real exchange API risk</div>
              <div>✓ P2P escrow state machine transitions enforced server-side</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
