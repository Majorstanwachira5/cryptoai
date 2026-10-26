"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { P2POffer, P2POrder } from "@/types/p2p";
import { formatCurrency, formatNumber } from "@/lib/utils";
import P2POrderFlowModal from "./P2POrderFlowModal";
import { ShieldCheck, CheckCircle2, Filter, Star, Clock } from "lucide-react";

export default function P2PMarketplace() {
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [side, setSide] = useState<"sell" | "buy">("sell"); // "sell" offer means user buys USDT
  const [fiat, setFiat] = useState<string>("USD");
  const [selectedOffer, setSelectedOffer] = useState<P2POffer | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>("500");
  const [activeOrder, setActiveOrder] = useState<P2POrder | null>(null);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      setOffers([...state.p2pOffers]);
    };
    update();
    return store.subscribe(update);
  }, []);

  const filteredOffers = offers.filter(
    (o) => o.side === side && (fiat === "ALL" || o.fiatCurrency === fiat)
  );

  const handleStartTrade = (offer: P2POffer) => {
    const amountNum = parseFloat(tradeAmount) || offer.minLimitFiat;
    const order = store.createP2POrder(offer.id, amountNum, offer.paymentMethods[0]);
    setActiveOrder(order);
    setSelectedOffer(null);
  };

  return (
    <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card select-none">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
        {/* Buy / Sell Tabs */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSide("sell")}
            className={`px-5 py-2 rounded font-extrabold text-xs transition-colors uppercase ${
              side === "sell"
                ? "bg-bull text-black shadow-md"
                : "bg-[#2B313A] text-[#848E9C] hover:text-white"
            }`}
          >
            Buy USDT
          </button>
          <button
            onClick={() => setSide("buy")}
            className={`px-5 py-2 rounded font-extrabold text-xs transition-colors uppercase ${
              side === "buy"
                ? "bg-bear text-white shadow-md"
                : "bg-[#2B313A] text-[#848E9C] hover:text-white"
            }`}
          >
            Sell USDT
          </button>
        </div>

        {/* Fiat selector & Filter */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-[#0B0E11] px-3 py-1.5 rounded border border-[#2B313A]">
            <span className="text-[#848E9C]">Currency:</span>
            <select
              value={fiat}
              onChange={(e) => setFiat(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="USD" className="bg-[#181A20]">USD ($)</option>
              <option value="EUR" className="bg-[#181A20]">EUR (€)</option>
              <option value="GBP" className="bg-[#181A20]">GBP (£)</option>
              <option value="ALL" className="bg-[#181A20]">All Currencies</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-bull bg-bull-dim px-2.5 py-1.5 rounded font-mono font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0% Escrow Fee</span>
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs tabular-nums">
          <thead>
            <tr className="text-[#848E9C] border-b border-[#23272E] text-[11px] font-semibold">
              <th className="py-2.5 pl-2">Advertiser</th>
              <th className="py-2.5 text-right">Price per USDT</th>
              <th className="py-2.5 text-right">Available / Limits</th>
              <th className="py-2.5 text-left pl-6">Payment Methods</th>
              <th className="py-2.5 text-right pr-2">Trade Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2329]">
            {filteredOffers.map((offer) => (
              <tr key={offer.id} className="hover:bg-[#1E2329] transition-colors">
                {/* Advertiser info */}
                <td className="py-3 pl-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#2B313A] flex items-center justify-center font-bold text-[#F0B90B] text-xs">
                      {offer.advertiserName[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-white text-xs">{offer.advertiserName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-bull" />
                      </div>
                      <div className="text-[10px] text-[#848E9C] mt-0.5">
                        {offer.completedOrders} orders · {offer.completionRate}% completion
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3 text-right">
                  <div className="font-mono text-sm font-extrabold text-white">
                    ${offer.pricePerUnit.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-[#848E9C]">{offer.fiatCurrency}</div>
                </td>

                {/* Available & Limits */}
                <td className="py-3 text-right">
                  <div className="text-white font-mono font-semibold">
                    {formatNumber(offer.availableAmount, 2)} USDT
                  </div>
                  <div className="text-[10px] text-[#848E9C] font-mono">
                    Limit: ${offer.minLimitFiat} - ${offer.maxLimitFiat}
                  </div>
                </td>

                {/* Payment Methods */}
                <td className="py-3 pl-6">
                  <div className="flex flex-wrap gap-1.5">
                    {offer.paymentMethods.map((pm) => (
                      <span
                        key={pm}
                        className="text-[10px] bg-[#0B0E11] text-[#EAECEF] px-2 py-0.5 rounded border border-[#2B313A] font-semibold"
                      >
                        {pm}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Trade Button */}
                <td className="py-3 text-right pr-2">
                  <button
                    onClick={() => setSelectedOffer(offer)}
                    className={`px-4 py-1.5 rounded font-extrabold text-xs transition-all ${
                      side === "sell"
                        ? "bg-bull hover:bg-bull-hover text-black shadow-sm"
                        : "bg-bear hover:bg-bear-hover text-white shadow-sm"
                    }`}
                  >
                    {side === "sell" ? "Buy USDT" : "Sell USDT"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Initiation Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181A20] border border-[#2B313A] rounded-lg shadow-dropdown w-full max-w-md p-5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#2B313A]">
              <span className="font-bold text-white text-sm">
                Initiate P2P Trade with {selectedOffer.advertiserName}
              </span>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-[#848E9C] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <label className="block text-[#848E9C] mb-1 font-semibold">I want to pay ({selectedOffer.fiatCurrency}):</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#F0B90B]"
                />
              </div>

              <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A] space-y-1.5">
                <div className="flex justify-between text-[#848E9C]">
                  <span>I will receive:</span>
                  <span className="font-mono text-bull font-bold text-sm">
                    {((parseFloat(tradeAmount) || 0) / selectedOffer.pricePerUnit).toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#5E6673]">
                  <span>Price:</span>
                  <span>${selectedOffer.pricePerUnit} / USDT</span>
                </div>
              </div>

              <div className="text-[11px] text-[#848E9C] italic">
                Terms: {selectedOffer.terms}
              </div>
            </div>

            <button
              onClick={() => handleStartTrade(selectedOffer)}
              className="w-full py-2.5 rounded bg-[#F0B90B] hover:bg-gold-hover text-black font-extrabold uppercase tracking-wide transition-colors"
            >
              Confirm and Lock Escrow
            </button>
          </div>
        </div>
      )}

      {/* Active Order Flow Modal */}
      {activeOrder && (
        <P2POrderFlowModal order={activeOrder} onClose={() => setActiveOrder(null)} />
      )}
    </div>
  );
}
