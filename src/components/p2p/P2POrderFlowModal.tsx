"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { P2POrder, P2POrderStatus } from "@/types/p2p";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  CreditCard,
  Lock,
} from "lucide-react";

interface P2POrderFlowModalProps {
  order: P2POrder;
  onClose: () => void;
}

export default function P2POrderFlowModal({ order: initialOrder, onClose }: P2POrderFlowModalProps) {
  const [order, setOrder] = useState<P2POrder>(initialOrder);
  const [chatMessage, setChatMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMarkPayment = () => {
    store.updateP2POrderStatus(
      order.id,
      "PAYMENT_MARKED",
      "Buyer has marked payment as transferred. Seller please verify payment receipt."
    );
    setOrder({ ...order, status: "PAYMENT_MARKED" });
  };

  const handleSimulateSellerVerifyAndRelease = () => {
    store.updateP2POrderStatus(
      order.id,
      "COMPLETED",
      "Seller confirmed payment receipt. Escrow has released USDT to buyer's wallet."
    );
    setOrder({ ...order, status: "COMPLETED" });
  };

  const handleDispute = () => {
    store.updateP2POrderStatus(
      order.id,
      "DISPUTED",
      "Order has been placed into dispute arbitration. Admin team notified."
    );
    setOrder({ ...order, status: "DISPUTED" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = {
      id: `msg_${Date.now()}`,
      sender: "You (Buyer)",
      text: chatMessage,
      timestamp: Date.now(),
    };
    order.messages.push(msg);
    setChatMessage("");
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const steps: { key: P2POrderStatus; label: string }[] = [
    { key: "FUNDS_RESERVED", label: "Escrow Locked" },
    { key: "PAYMENT_PENDING", label: "Make Payment" },
    { key: "PAYMENT_MARKED", label: "Payment Marked" },
    { key: "COMPLETED", label: "Released" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#181A20] border border-[#2B313A] rounded-lg shadow-dropdown w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#2B313A] flex items-center justify-between bg-[#1E2329]">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-[#F0B90B]" />
            <div>
              <span className="font-extrabold text-white text-sm">P2P Order: {order.orderNumber}</span>
              <span className="text-[10px] text-[#848E9C] block">
                Counterparty: {order.sellerName} · Ref: {order.referenceCode}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#848E9C] hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Timeline Bar */}
        <div className="bg-[#0B0E11] px-6 py-3 border-b border-[#2B313A] flex items-center justify-between text-xs">
          {steps.map((st, i) => {
            const isCompleted =
              order.status === "COMPLETED" ||
              (order.status === "PAYMENT_MARKED" && (st.key === "FUNDS_RESERVED" || st.key === "PAYMENT_PENDING")) ||
              (order.status === "FUNDS_RESERVED" && st.key === "FUNDS_RESERVED");

            return (
              <div key={st.key} className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    isCompleted ? "bg-bull text-black" : "bg-[#2B313A] text-[#848E9C]"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`font-semibold ${isCompleted ? "text-white" : "text-[#5E6673]"}`}>
                  {st.label}
                </span>
                {i < steps.length - 1 && <div className="w-12 h-0.5 bg-[#2B313A] hidden sm:block" />}
              </div>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Order Payment Details */}
          <div className="space-y-4">
            <div className="bg-[#0B0E11] p-4 rounded border border-[#2B313A] space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#23272E]">
                <span className="text-[#848E9C]">Amount to Pay:</span>
                <span className="font-mono text-base font-extrabold text-[#F0B90B] tabular-nums">
                  {formatCurrency(order.fiatAmount, 2, "$")} {order.fiatCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#848E9C]">You Receive:</span>
                <span className="font-mono font-bold text-bull tabular-nums">
                  {order.cryptoAmount} {order.asset}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#848E9C]">Unit Price:</span>
                <span className="font-mono text-white tabular-nums">
                  ${order.pricePerUnit} / {order.asset}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#848E9C]">Payment Method:</span>
                <span className="text-white font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#848E9C]">Payment Reference:</span>
                <span className="font-mono text-[#F0B90B] bg-[#1E2329] px-2 py-0.5 rounded font-bold">
                  {order.referenceCode}
                </span>
              </div>
            </div>

            {/* Countdown or status alert */}
            {order.status !== "COMPLETED" && order.status !== "DISPUTED" && (
              <div className="bg-[#1E2329] p-3 rounded border border-bull/30 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4 text-bull" />
                  <span>Time remaining to transfer:</span>
                </div>
                <span className="font-mono font-bold text-bull text-sm tabular-nums">
                  {formatTimer(timeLeft)}
                </span>
              </div>
            )}

            {order.status === "COMPLETED" && (
              <div className="bg-bull-dim border border-bull p-3 rounded text-center text-bull text-xs font-bold">
                ✓ Order Completed! {order.cryptoAmount} USDT credited to your internal ledger.
              </div>
            )}

            {order.status === "DISPUTED" && (
              <div className="bg-bear-dim border border-bear p-3 rounded text-center text-bear text-xs font-bold">
                ⚠️ Dispute Raised. Admin arbitrator is reviewing transaction proof.
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {order.status === "FUNDS_RESERVED" && (
                <button
                  onClick={handleMarkPayment}
                  className="w-full py-2.5 rounded bg-[#F0B90B] hover:bg-gold-hover text-black font-extrabold text-xs uppercase tracking-wide transition-colors"
                >
                  Transferred, Notify Seller
                </button>
              )}

              {order.status === "PAYMENT_MARKED" && (
                <div className="space-y-2">
                  <div className="text-[11px] text-[#848E9C] text-center">
                    Payment marked! Simulating counterparty verification:
                  </div>
                  <button
                    onClick={handleSimulateSellerVerifyAndRelease}
                    className="w-full py-2 rounded bg-bull hover:bg-bull-hover text-black font-bold text-xs uppercase transition-colors"
                  >
                    Simulate Seller Confirm & Release USDT
                  </button>
                </div>
              )}

              {order.status !== "COMPLETED" && (
                <button
                  onClick={handleDispute}
                  className="w-full py-1.5 rounded bg-[#2B313A] hover:bg-[#363D47] text-[#848E9C] hover:text-white text-xs font-semibold transition-colors"
                >
                  Need Help? Open Dispute
                </button>
              )}
            </div>
          </div>

          {/* Real-time Order Chat & Escrow Messages */}
          <div className="bg-[#0B0E11] p-3 rounded border border-[#2B313A] flex flex-col h-72 text-xs">
            <div className="font-bold text-white pb-2 border-b border-[#23272E] flex items-center justify-between">
              <span>Order Chat</span>
              <span className="text-[10px] text-bull flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Escrow Protected</span>
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-2">
              {order.messages.map((m) => (
                <div key={m.id} className="p-2 rounded bg-[#181A20] border border-[#23272E]">
                  <div className="flex justify-between text-[10px] text-[#848E9C]">
                    <span className="font-semibold text-white">{m.sender}</span>
                    <span>{formatTimestamp(m.timestamp)}</span>
                  </div>
                  <div className="text-xs text-[#EAECEF] mt-1">{m.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#23272E]">
              <input
                type="text"
                placeholder="Type message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-[#181A20] border border-[#2B313A] rounded px-3 py-1.5 text-xs text-white placeholder-[#5E6673] focus:outline-none focus:border-[#F0B90B]"
              />
              <button
                type="submit"
                className="p-1.5 rounded bg-[#2B313A] hover:bg-[#363D47] text-[#F0B90B]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
