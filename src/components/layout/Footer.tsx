"use client";

import React from "react";
import { ShieldCheck, Wifi, Cpu, Server } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#181A20] border-t border-[#2B313A] py-3 px-4 text-xs text-[#848E9C]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Operational telemetry */}
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-bull animate-pulse" />
            <span className="font-semibold text-[#EAECEF]">Trading Engine: Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wifi className="w-3 h-3 text-bull" />
            <span>WebSocket Latency: 14ms</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-[#F0B90B]" />
            <span>Mode: Paper Matching Simulator</span>
          </div>
          <div className="flex items-center space-x-1">
            <Server className="w-3 h-3 text-blue-400" />
            <span>Port: 3300 (Isolated DevOps)</span>
          </div>
        </div>

        {/* Right: Legal & Disclaimer */}
        <div className="text-[10px] text-center md:text-right text-[#5E6673]">
          © 2026 CRYPTOBULL.AI. All synthetic balances and paper trades are simulated for quantitative testing and education.
        </div>
      </div>
    </footer>
  );
}
