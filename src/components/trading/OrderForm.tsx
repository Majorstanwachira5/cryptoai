"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { getCurrentPrice, SUPPORTED_PAIRS } from "@/lib/marketData";
import { OrderSide, OrderType } from "@/types/trading";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface OrderFormProps {
  symbol: string;
  externalPrice?: number;
}

export default function OrderForm({ symbol, externalPrice }: OrderFormProps) {
  const pair = SUPPORTED_PAIRS.find((p) => p.symbol === symbol) || SUPPORTED_PAIRS[0];
  const [side, setSide] = useState<OrderSide>("buy");
  const [orderType, setOrderType] = useState<OrderType>("limit");
  const [priceInput, setPriceInput] = useState<string>("");
  const [amountInput, setAmountInput] = useState<string>("");
  const [availableUSDT, setAvailableUSDT] = useState<number>(15420.50);
  const [availableBase, setAvailableBase] = useState<number>(0.3542);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const current = externalPrice || getCurrentPrice(symbol);
    setPriceInput(current.toString());
  }, [symbol, externalPrice]);

  useEffect(() => {
    const updateBalances = () => {
      const state = store.getState();
      setAvailableUSDT(state.balances["USDT"]?.free || 0);
      setAvailableBase(state.balances[pair.baseAsset]?.free || 0);
    };
    updateBalances();
    return store.subscribe(updateBalances);
  }, [pair.baseAsset]);

  const priceNum = parseFloat(priceInput) || 0;
  const amountNum = parseFloat(amountInput) || 0;
  const totalCost = orderType === "market" ? amountNum * getCurrentPrice(symbol) : amountNum * priceNum;
  const fee = totalCost * 0.001; // 0.1% standard exchange fee

  const handlePercentage = (percent: number) => {
    if (side === "buy") {
      const quoteToSpend = (availableUSDT * percent) / 100;
      const effectivePrice = orderType === "market" ? getCurrentPrice(symbol) : priceNum;
      if (effectivePrice > 0) {
        const calculatedAmount = quoteToSpend / effectivePrice;
        setAmountInput(calculatedAmount.toFixed(pair.amountPrecision));
      }
    } else {
      const baseToSell = (availableBase * percent) / 100;
      setAmountInput(baseToSell.toFixed(pair.amountPrecision));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountNum <= 0) {
      setMessage({ text: "Please enter a valid amount", type: "error" });
      return;
    }

    if (side === "buy") {
      if (totalCost > availableUSDT) {
        setMessage({ text: `Insufficient USDT balance. Available: ${formatCurrency(availableUSDT)}`, type: "error" });
        return;
      }
    } else {
      if (amountNum > availableBase) {
        setMessage({ text: `Insufficient ${pair.baseAsset} balance. Available: ${formatNumber(availableBase, 4)}`, type: "error" });
        return;
      }
    }

    try {
      const order = store.submitPaperOrder({
        symbol,
        side,
        type: orderType,
        price: orderType === "market" ? getCurrentPrice(symbol) : priceNum,
        amount: amountNum,
        fee,
        feeAsset: "USDT",
        totalCost,
      });

      setMessage({
        text: `Paper Order ${order.status === "filled" ? "Executed" : "Placed"}: ${side.toUpperCase()} ${amountNum} ${pair.baseAsset}`,
        type: "success",
      });
      setAmountInput("");
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      setMessage({ text: err?.message || "Order submission failed", type: "error" });
    }
  };

  return (
    <div className="bg-[#181A20] p-3 text-xs select-none flex flex-col justify-between h-full border-t border-[#2B313A]">
      <div>
        {/* Order Type Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#2B313A] pb-2 mb-3">
          {(["limit", "market", "stop_limit"] as OrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`font-semibold capitalize px-2 py-0.5 rounded transition-colors ${
                orderType === t ? "text-[#F0B90B] bg-[#2B313A]" : "text-[#848E9C] hover:text-[#EAECEF]"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Buy / Sell Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setSide("buy")}
            className={`py-1.5 rounded font-bold text-xs uppercase transition-colors ${
              side === "buy" ? "bg-bull text-black" : "bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF]"
            }`}
          >
            Buy {pair.baseAsset}
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`py-1.5 rounded font-bold text-xs uppercase transition-colors ${
              side === "sell" ? "bg-bear text-white" : "bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF]"
            }`}
          >
            Sell {pair.baseAsset}
          </button>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`mb-3 p-2 rounded flex items-center space-x-2 text-[11px] ${
              message.type === "success" ? "bg-bull-dim text-bull border border-bull/20" : "bg-bear-dim text-bear border border-bear/20"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Available Balances */}
        <div className="flex items-center justify-between text-[11px] text-[#848E9C] mb-3">
          <span>Available:</span>
          <span className="font-mono text-white tabular-nums font-semibold">
            {side === "buy" ? `${formatCurrency(availableUSDT, 2)}` : `${formatNumber(availableBase, 4)} ${pair.baseAsset}`}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Price Input (hidden or disabled in Market mode) */}
          {orderType !== "market" ? (
            <div>
              <label className="block text-[10px] text-[#848E9C] mb-1 font-semibold">Price (USDT)</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#F0B90B] tabular-nums"
                  required
                />
                <span className="absolute right-3 top-1.5 text-[10px] text-[#848E9C] font-mono">USDT</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-center text-[#848E9C] font-mono text-xs">
              Market Price (Best execution)
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-[10px] text-[#848E9C] mb-1 font-semibold">Amount ({pair.baseAsset})</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#F0B90B] tabular-nums"
                required
              />
              <span className="absolute right-3 top-1.5 text-[10px] text-[#848E9C] font-mono">{pair.baseAsset}</span>
            </div>
          </div>

          {/* Percentage Quick Selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentage(pct)}
                className="py-1 rounded bg-[#1E2329] hover:bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF] font-mono text-[10px] transition-colors border border-[#2B313A]"
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Estimated Calculations */}
          <div className="bg-[#0B0E11] p-2 rounded border border-[#2B313A] space-y-1 text-[11px] text-[#848E9C]">
            <div className="flex justify-between">
              <span>Order Value:</span>
              <span className="font-mono text-white tabular-nums font-semibold">{formatCurrency(totalCost, 2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Simulated Fee (0.1%):</span>
              <span className="font-mono text-[#848E9C] tabular-nums">{formatCurrency(fee, 2)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className={`w-full py-2.5 rounded font-extrabold text-xs uppercase tracking-wide shadow-md transition-all ${
              side === "buy"
                ? "bg-bull hover:bg-bull-hover text-black"
                : "bg-bear hover:bg-bear-hover text-white"
            }`}
          >
            {side === "buy" ? `Buy ${pair.baseAsset} (Paper)` : `Sell ${pair.baseAsset} (Paper)`}
          </button>
        </form>
      </div>

      <div className="mt-3 pt-2 border-t border-[#2B313A] text-[10px] text-center text-[#5E6673]">
        ⚡ Instant simulated execution against real order book prices
      </div>
    </div>
  );
}
