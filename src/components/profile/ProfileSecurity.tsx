"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { UserProfile } from "@/types/auth";
import { formatDate, formatTimestamp } from "@/lib/utils";
import {
  ShieldCheck,
  User,
  KeyRound,
  Smartphone,
  Lock,
  CheckCircle2,
  AlertTriangle,
  History,
} from "lucide-react";

export default function ProfileSecurity() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [twoFactor, setTwoFactor] = useState(true);
  const [antiPhishing, setAntiPhishing] = useState("CRYPTOBULL_SECURE_99");
  const [saveMsg, setSaveMsg] = useState(false);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      setProfile({ ...state.user });
      setTwoFactor(state.user.twoFactorEnabled);
      setAntiPhishing(state.user.antiPhishingCode || "CRYPTOBULL_SECURE_99");
    };
    update();
    return store.subscribe(update);
  }, []);

  if (!profile) return null;

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSecurityProfile({
      twoFactorEnabled: twoFactor,
      antiPhishingCode: antiPhishing,
    });
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2500);
  };

  return (
    <div className="space-y-6 select-none text-xs">
      {/* Profile Overview Card */}
      <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#F0B90B] flex items-center justify-center font-extrabold text-black text-lg">
              {profile.username[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white">{profile.username}</h2>
                <span className="text-[10px] bg-bull-dim text-bull px-2 py-0.5 rounded font-mono font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>KYC Tier 2 Verified</span>
                </span>
              </div>
              <div className="text-[11px] text-[#848E9C] mt-0.5">
                UID: <strong className="text-white font-mono">{profile.uid}</strong> · Role: <strong className="text-[#F0B90B]">{profile.role.toUpperCase()}</strong> · Email: {profile.email}
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings Form */}
        <form onSubmit={handleSaveSecurity} className="mt-5 space-y-4 max-w-xl">
          <div className="flex items-center justify-between p-3 rounded bg-[#0B0E11] border border-[#2B313A]">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-bull" />
              <div>
                <div className="font-bold text-white">Google / TOTP Two-Factor Authentication</div>
                <div className="text-[11px] text-[#848E9C]">Used to authorize sensitive internal transfers and logins</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactor(!twoFactor)}
              className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${
                twoFactor ? "bg-bull text-black" : "bg-[#2B313A] text-[#848E9C]"
              }`}
            >
              {twoFactor ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="p-3 rounded bg-[#0B0E11] border border-[#2B313A]">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#F0B90B]" />
              <label className="font-bold text-white">Anti-Phishing Verification Code</label>
            </div>
            <p className="text-[11px] text-[#848E9C] mb-2">
              This phrase will be displayed on all official CRYPTOBULL simulated email receipts to prevent spoofing.
            </p>
            <input
              type="text"
              value={antiPhishing}
              onChange={(e) => setAntiPhishing(e.target.value)}
              className="w-full bg-[#181A20] border border-[#2B313A] rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#F0B90B]"
            />
          </div>

          {saveMsg && (
            <div className="p-2.5 rounded bg-bull-dim text-bull border border-bull/20 font-bold">
              ✓ Security settings updated and persisted.
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2 rounded bg-[#F0B90B] hover:bg-gold-hover text-black font-extrabold text-xs uppercase tracking-wide transition-colors"
          >
            Save Security Changes
          </button>
        </form>
      </div>

      {/* Security Activity Log */}
      <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#2B313A]">
          <History className="w-4 h-4 text-[#F0B90B]" />
          <h3 className="font-extrabold text-sm text-white">Recent Security & Login Activity</h3>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs tabular-nums">
            <thead>
              <tr className="text-[#848E9C] border-b border-[#23272E] text-[11px] font-semibold">
                <th className="py-2 pl-2">Time</th>
                <th className="py-2">Action</th>
                <th className="py-2">IP Address</th>
                <th className="py-2">Location</th>
                <th className="py-2">Device</th>
                <th className="py-2 text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2329]">
              {profile.securityActivity.map((act) => (
                <tr key={act.id} className="hover:bg-[#1E2329]">
                  <td className="py-2.5 pl-2 text-[#848E9C] font-mono">
                    {formatDate(act.timestamp)} {formatTimestamp(act.timestamp)}
                  </td>
                  <td className="py-2.5 text-white font-semibold">{act.action}</td>
                  <td className="py-2.5 font-mono text-[#848E9C]">{act.ipAddress}</td>
                  <td className="py-2.5 text-[#848E9C]">{act.location}</td>
                  <td className="py-2.5 text-[#848E9C]">{act.device}</td>
                  <td className="py-2.5 text-right pr-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-bull-dim text-bull font-bold uppercase">
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
