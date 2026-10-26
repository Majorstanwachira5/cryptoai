"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { PaperOrder, Position, TradeHistoryItem } from "@/types/trading";
import { AssetBalance } from "@/types/ledger";
import { formatCurrency, formatNumber, formatPercent, formatTimestamp } from "@/lib/utils";
import { Trash2, AlertCircle } from "lucide-react";

export default function OrdersAndPositions() {
  const [activeTab, setActiveTab] = useState<"open" | "positions" | "orders" | "trades" | "assets">("open");
  const [openOrders, setOpenOrders] = useState<PaperOrder[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orderHistory, setOrderHistory] = useState<PaperOrder[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [balances, setBalances] = useState<Record<string, AssetBalance>>({});

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      setOpenOrders([...state.openOrders]);
      setPositions([...state.positions]);
      setOrderHistory([...state.orderHistory]);
      setTradeHistory([...state.tradeHistory]);
      setBalances({ ...state.balances });
    };
    update();
    return store.subscribe(update);
  }, []);

  const handleCancel = (orderId: string) => {
    store.cancelOrder(orderId);
  };

  const tabs = [
    { key: "open", label: `Open Orders (${openOrders.length})` },
    { key: "positions", label: `Positions (${positions.length})` },
    { key: "orders", label: "Order History" },
    { key: "trades", label: "Trade History" },
    { key: "assets", label: "Assets" },
  ];

  return (
    <div className="bg-[#181A20] border-t border-[#2B313A] flex flex-col h-full select-none text-xs">
      {/* Tabs */}
      <div className="flex items-center space-x-4 px-4 border-b border-[#2B313A] bg-[#181A20]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2 text-xs font-bold transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-[#F0B90B] text-[#F0B90B]"
                : "border-transparent text-[#848E9C] hover:text-[#EAECEF]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-auto p-2 min-h-[160px]">
        {/* Open Orders */}
        {activeTab === "open" && (
          <div>
            {openOrders.length === 0 ? (
              <div className="text-center py-8 text-[#5E6673]">No open paper orders</div>
            ) : (
              <table className="w-full text-left tabular-nums text-[11px]">
                <thead>
                  <tr className="text-[#848E9C] border-b border-[#23272E]">
                    <th className="pb-1.5 font-semibold">Time</th>
                    <th className="pb-1.5 font-semibold">Pair</th>
                    <th className="pb-1.5 font-semibold">Type</th>
                    <th className="pb-1.5 font-semibold">Side</th>
                    <th className="pb-1.5 font-semibold text-right">Price</th>
                    <th className="pb-1.5 font-semibold text-right">Amount</th>
                    <th className="pb-1.5 font-semibold text-right">Total</th>
                    <th className="pb-1.5 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2329]">
                  {openOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1E2329]">
                      <td className="py-2 text-[#848E9C] font-mono">{formatTimestamp(ord.createdAt)}</td>
                      <td className="py-2 font-bold text-white">{ord.symbol}</td>
                      <td className="py-2 uppercase text-[#848E9C]">{ord.type}</td>
                      <td className={`py-2 uppercase font-bold ${ord.side === "buy" ? "text-bull" : "text-bear"}`}>
                        {ord.side}
                      </td>
                      <td className="py-2 text-right font-mono">{formatCurrency(ord.price)}</td>
                      <td className="py-2 text-right font-mono">{formatNumber(ord.amount, 4)}</td>
                      <td className="py-2 text-right font-mono">{formatCurrency(ord.totalCost)}</td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => handleCancel(ord.id)}
                          className="text-[#848E9C] hover:text-bear p-1 rounded transition-colors"
                          title="Cancel Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Positions */}
        {activeTab === "positions" && (
          <div>
            {positions.length === 0 ? (
              <div className="text-center py-8 text-[#5E6673]">No open positions</div>
            ) : (
              <table className="w-full text-left tabular-nums text-[11px]">
                <thead>
                  <tr className="text-[#848E9C] border-b border-[#23272E]">
                    <th className="pb-1.5 font-semibold">Symbol</th>
                    <th className="pb-1.5 font-semibold text-right">Size</th>
                    <th className="pb-1.5 font-semibold text-right">Entry Price</th>
                    <th className="pb-1.5 font-semibold text-right">Mark Price</th>
                    <th className="pb-1.5 font-semibold text-right">Market Value</th>
                    <th className="pb-1.5 font-semibold text-right">Unrealized PnL (ROE %)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2329]">
                  {positions.map((pos) => {
                    const isProfit = pos.unrealizedPnL >= 0;
                    return (
                      <tr key={pos.symbol} className="hover:bg-[#1E2329]">
                        <td className="py-2 font-bold text-white">{pos.symbol}</td>
                        <td className="py-2 text-right font-mono">{formatNumber(pos.amount, 4)}</td>
                        <td className="py-2 text-right font-mono">{formatCurrency(pos.entryPrice)}</td>
                        <td className="py-2 text-right font-mono">{formatCurrency(pos.currentPrice)}</td>
                        <td className="py-2 text-right font-mono">{formatCurrency(pos.marketValue)}</td>
                        <td className={`py-2 text-right font-mono font-bold ${isProfit ? "text-bull" : "text-bear"}`}>
                          {formatCurrency(pos.unrealizedPnL)} ({formatPercent(pos.unrealizedPnLPercent)})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Order History */}
        {activeTab === "orders" && (
          <div>
            {orderHistory.length === 0 ? (
              <div className="text-center py-8 text-[#5E6673]">No past order history</div>
            ) : (
              <table className="w-full text-left tabular-nums text-[11px]">
                <thead>
                  <tr className="text-[#848E9C] border-b border-[#23272E]">
                    <th className="pb-1.5 font-semibold">Time</th>
                    <th className="pb-1.5 font-semibold">Symbol</th>
                    <th className="pb-1.5 font-semibold">Type</th>
                    <th className="pb-1.5 font-semibold">Side</th>
                    <th className="pb-1.5 font-semibold text-right">Price</th>
                    <th className="pb-1.5 font-semibold text-right">Executed</th>
                    <th className="pb-1.5 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2329]">
                  {orderHistory.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1E2329]">
                      <td className="py-2 text-[#848E9C] font-mono">{formatTimestamp(ord.updatedAt)}</td>
                      <td className="py-2 font-bold text-white">{ord.symbol}</td>
                      <td className="py-2 uppercase text-[#848E9C]">{ord.type}</td>
                      <td className={`py-2 uppercase font-bold ${ord.side === "buy" ? "text-bull" : "text-bear"}`}>
                        {ord.side}
                      </td>
                      <td className="py-2 text-right font-mono">{formatCurrency(ord.price)}</td>
                      <td className="py-2 text-right font-mono">{formatNumber(ord.filledAmount, 4)}</td>
                      <td className="py-2 text-center uppercase font-bold text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            ord.status === "filled"
                              ? "bg-bull-dim text-bull"
                              : ord.status === "cancelled"
                              ? "bg-bear-dim text-bear"
                              : "bg-[#2B313A] text-[#848E9C]"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Trade History */}
        {activeTab === "trades" && (
          <div>
            {tradeHistory.length === 0 ? (
              <div className="text-center py-8 text-[#5E6673]">No trade executions yet</div>
            ) : (
              <table className="w-full text-left tabular-nums text-[11px]">
                <thead>
                  <tr className="text-[#848E9C] border-b border-[#23272E]">
                    <th className="pb-1.5 font-semibold">Time</th>
                    <th className="pb-1.5 font-semibold">Pair</th>
                    <th className="pb-1.5 font-semibold">Side</th>
                    <th className="pb-1.5 font-semibold text-right">Price</th>
                    <th className="pb-1.5 font-semibold text-right">Filled</th>
                    <th className="pb-1.5 font-semibold text-right">Fee</th>
                    <th className="pb-1.5 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2329]">
                  {tradeHistory.map((trd) => (
                    <tr key={trd.id} className="hover:bg-[#1E2329]">
                      <td className="py-2 text-[#848E9C] font-mono">{formatTimestamp(trd.timestamp)}</td>
                      <td className="py-2 font-bold text-white">{trd.symbol}</td>
                      <td className={`py-2 uppercase font-bold ${trd.side === "buy" ? "text-bull" : "text-bear"}`}>
                        {trd.side}
                      </td>
                      <td className="py-2 text-right font-mono">{formatCurrency(trd.price)}</td>
                      <td className="py-2 text-right font-mono">{formatNumber(trd.amount, 4)}</td>
                      <td className="py-2 text-right font-mono text-[#848E9C]">{formatCurrency(trd.fee)}</td>
                      <td className="py-2 text-right font-mono font-semibold text-white">{formatCurrency(trd.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Assets Overview */}
        {activeTab === "assets" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.values(balances).map((bal) => (
                <div key={bal.asset} className="bg-[#0B0E11] p-3 rounded border border-[#2B313A]">
                  <div className="text-[#848E9C] font-bold text-xs">{bal.asset}</div>
                  <div className="text-sm font-extrabold text-white font-mono mt-1">{formatNumber(bal.total, 4)}</div>
                  <div className="text-[10px] text-[#5E6673] mt-0.5">Free: {formatNumber(bal.free, 4)} | Lock: {formatNumber(bal.locked, 4)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
