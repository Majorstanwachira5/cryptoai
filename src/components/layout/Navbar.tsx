"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  BarChart2,
  Wallet,
  Users,
  Shield,
  Layers,
  Coins,
  Bell,
  Eye,
  EyeOff,
  Zap,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [hideBalances, setHideBalances] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [totalUsdt, setTotalUsdt] = useState(16670.50);
  const [faucetClaimed, setFaucetClaimed] = useState(false);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      const usdt = state.balances["USDT"]?.total || 0;
      setTotalUsdt(usdt);
    };
    update();
    return store.subscribe(update);
  }, []);

  const handleClaimFaucet = () => {
    store.claimFaucet(5000);
    setFaucetClaimed(true);
    setTimeout(() => setFaucetClaimed(false), 2500);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Markets", href: "/markets" },
    { name: "Trade (Spot)", href: "/trade", badge: "Live" },
    { name: "P2P", href: "/p2p" },
    { name: "Backtest", href: "/backtest", badge: "Quant" },
    { name: "Wallet", href: "/wallet" },
    { name: "Referrals", href: "/referrals" },
    { name: "Admin", href: "/admin", badge: "Pro" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#181A20] border-b border-[#2B313A] select-none">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Brand & Main Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded bg-[#F0B90B] flex items-center justify-center text-black font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">
                  CRYPTO<span className="text-[#F0B90B]">BULL</span>
                </span>
                <span className="text-[10px] bg-[#2B313A] text-[#F0B90B] px-1.5 py-0.5 rounded font-mono font-bold">
                  AI
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-[#F0B90B] bg-[#1E2329]"
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#1E2329]"
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span>{link.name}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                          link.badge === "Live"
                            ? "bg-bull-dim text-bull"
                            : link.badge === "Quant"
                            ? "bg-purple-950 text-purple-400 border border-purple-800"
                            : "bg-[#2B313A] text-[#F0B90B]"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Balance, Faucet, Notifications, User */}
        <div className="flex items-center space-x-3">
          {/* Quick Demo Faucet Button */}
          <button
            onClick={handleClaimFaucet}
            title="Claim $5,000 synthetic testnet USDT to trade"
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded bg-[#2B313A] hover:bg-[#363D47] text-[#F0B90B] transition-colors border border-[#474D57]"
          >
            <Zap className="w-3.5 h-3.5 text-[#F0B90B] fill-[#F0B90B]" />
            <span>{faucetClaimed ? "Credited +$5,000!" : "+$5,000 Faucet"}</span>
          </button>

          {/* Balance Preview */}
          <div className="hidden md:flex items-center space-x-2 bg-[#0B0E11] px-3 py-1 rounded border border-[#2B313A]">
            <span className="text-[11px] text-[#848E9C]">Simulated Bal:</span>
            <span className="text-xs font-bold text-[#EAECEF] tabular-nums font-mono">
              {hideBalances ? "••••••" : formatCurrency(totalUsdt, 2)}
            </span>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="text-[#848E9C] hover:text-[#EAECEF] transition-colors"
            >
              {hideBalances ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#1E2329] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F0B90B]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1E2329] border border-[#2B313A] rounded shadow-dropdown p-3 text-xs z-50">
                <div className="flex items-center justify-between border-b border-[#2B313A] pb-2 mb-2">
                  <span className="font-bold text-white">Notifications</span>
                  <span className="text-[10px] text-[#848E9C]">Mark all read</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-[#181A20] border-l-2 border-[#0ECB81]">
                    <div className="font-semibold text-white">Paper Trading Engine Active</div>
                    <div className="text-[11px] text-[#848E9C]">Real-time market matching with 0-risk execution.</div>
                    <div className="text-[9px] text-[#5E6673] mt-1">10m ago</div>
                  </div>
                  <div className="p-2 rounded bg-[#181A20] border-l-2 border-[#F0B90B]">
                    <div className="font-semibold text-white">Affiliate Tier Upgrade</div>
                    <div className="text-[11px] text-[#848E9C]">You are eligible for VIP Tier 2 commission (25%).</div>
                    <div className="text-[9px] text-[#5E6673] mt-1">1h ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 pl-2 pr-1.5 py-1 rounded bg-[#1E2329] hover:bg-[#2B313A] transition-colors border border-[#2B313A]"
            >
              <div className="w-6 h-6 rounded-full bg-[#2B313A] flex items-center justify-center text-xs font-bold text-[#F0B90B]">
                B
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-semibold text-white leading-tight">BullTrader</span>
                <span className="text-[9px] text-[#0ECB81] leading-tight">UID: 88291045</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#848E9C]" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1E2329] border border-[#2B313A] rounded shadow-dropdown p-2 text-xs z-50">
                <div className="px-3 py-2 border-b border-[#2B313A]">
                  <div className="font-bold text-white">BullTrader_Pro</div>
                  <div className="text-[10px] text-[#848E9C]">trader@cryptobull.ai</div>
                  <div className="flex items-center space-x-1 mt-1 text-[10px] text-[#0ECB81]">
                    <CheckCircle2 className="w-3 h-3 text-[#0ECB81]" />
                    <span>KYC Tier 2 Verified</span>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded text-[#848E9C] hover:text-white hover:bg-[#2B313A] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Security & 2FA</span>
                  </Link>
                  <Link
                    href="/wallet"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded text-[#848E9C] hover:text-white hover:bg-[#2B313A] transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Asset Overview</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded text-[#848E9C] hover:text-[#F0B90B] hover:bg-[#2B313A] transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Admin Command Center</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
