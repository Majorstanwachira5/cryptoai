"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { AssetBalance, LedgerTransaction } from "@/types/ledger";
import { formatCurrency, formatNumber, formatDate, formatTimestamp } from "@/lib/utils";
import {
  Wallet,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertCircle,
} from "lucide-react";

export default function WalletDashboard() {
  const [balances, setBalances] = useState<Record<string, AssetBalance>>({});
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferAsset, setTransferAsset] = useState("USDT");
  const [transferNote, setTransferNote] = useState("");
  const [transferMsg, setTransferMsg] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    const update = () => {
      const state = store.getState();
      setBalances({ ...state.balances });
      setLedger([...state.ledger]);
    };
    update();
    return store.subscribe(update);
  }, []);

  const totalUsdt = balances["USDT"]?.total || 0;
  const availableUsdt = balances["USDT"]?.free || 0;
  const lockedUsdt = balances["USDT"]?.locked || 0;

  const handleInternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);
    if (!recipient.trim() || isNaN(amountNum) || amountNum <= 0) {
      setTransferMsg({ text: "Please provide a valid recipient UID/email and amount.", success: false });
      return;
    }

    const res = store.executeInternalTransfer({
      recipientIdentifier: recipient,
      asset: transferAsset,
      amount: amountNum,
      note: transferNote,
    });

    setTransferMsg({ text: res.message, success: res.success });
    if (res.success) {
      setTransferAmount("");
      setRecipient("");
      setTransferNote("");
      setTimeout(() => {
        setTransferModalOpen(false);
        setTransferMsg(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 select-none text-xs">
      {/* Top Banner: Synthetic Ledger Notice */}
      <div className="bg-[#181A20] p-4 rounded border border-[#2B313A] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#F0B90B]/20 text-[#F0B90B] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-sm">Internal Double-Entry Ledger System</span>
              <span className="text-[10px] bg-bull-dim text-bull px-1.5 py-0.2 rounded font-mono font-bold">
                Zero Counterparty Risk
              </span>
            </div>
            <p className="text-[11px] text-[#848E9C] mt-0.5">
              All balances are authoritative backend-verified ledger credits for simulated paper exchange operations.
            </p>
          </div>
        </div>

        <button
          onClick={() => store.claimFaucet(5000)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded bg-[#2B313A] hover:bg-[#363D47] text-[#F0B90B] font-bold text-xs transition-colors border border-[#474D57] shrink-0"
        >
          <Zap className="w-4 h-4 fill-[#F0B90B]" />
          <span>Claim +$5,000 Faucet</span>
        </button>
      </div>

      {/* Main Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A]">
          <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Total Ledger Balance</span>
          <div className="text-2xl font-extrabold text-white font-mono mt-1 tabular-nums">
            {formatCurrency(totalUsdt)}
          </div>
          <div className="text-[10px] text-[#5E6673] mt-1">Authoritative asset base</div>
        </div>

        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A]">
          <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Available USDT</span>
          <div className="text-2xl font-extrabold text-bull font-mono mt-1 tabular-nums">
            {formatCurrency(availableUsdt)}
          </div>
          <div className="text-[10px] text-bull mt-1">Free for spot & P2P trading</div>
        </div>

        <div className="bg-[#181A20] p-4 rounded border border-[#2B313A] flex flex-col justify-between">
          <div>
            <span className="text-[#848E9C] font-semibold text-[11px] uppercase">Reserved (In Orders / Escrow)</span>
            <div className="text-2xl font-extrabold text-[#F0B90B] font-mono mt-1 tabular-nums">
              {formatCurrency(lockedUsdt)}
            </div>
          </div>
          <button
            onClick={() => setTransferModalOpen(true)}
            className="w-full mt-2 py-2 rounded bg-[#1E2329] hover:bg-[#2B313A] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-[#2B313A]"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Send Zero-Fee Internal Transfer</span>
          </button>
        </div>
      </div>

      {/* Asset Breakdown Table */}
      <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card">
        <h3 className="font-extrabold text-sm text-white pb-3 border-b border-[#2B313A]">
          All Asset Accounts
        </h3>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs tabular-nums">
            <thead>
              <tr className="text-[#848E9C] border-b border-[#23272E] text-[11px] font-semibold">
                <th className="py-2.5 pl-2">Asset</th>
                <th className="py-2.5 text-right">Free Available</th>
                <th className="py-2.5 text-right">Locked / In-Order</th>
                <th className="py-2.5 text-right">Total Balance</th>
                <th className="py-2.5 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2329]">
              {Object.values(balances).map((bal) => (
                <tr key={bal.asset} className="hover:bg-[#1E2329]">
                  <td className="py-3 pl-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{bal.asset}</span>
                      <span className="text-[10px] text-[#848E9C]">{bal.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-white">
                    {formatNumber(bal.free, 4)}
                  </td>
                  <td className="py-3 text-right font-mono text-[#848E9C]">
                    {formatNumber(bal.locked, 4)}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-[#F0B90B]">
                    {formatNumber(bal.total, 4)}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => {
                        setTransferAsset(bal.asset);
                        setTransferModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-[#2B313A] hover:bg-[#363D47] text-white text-xs font-semibold"
                    >
                      Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Double-Entry Transaction Ledger Table */}
      <div className="bg-[#181A20] rounded border border-[#2B313A] p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#2B313A]">
          <h3 className="font-extrabold text-sm text-white">Authoritative Double-Entry Ledger History</h3>
          <span className="text-[10px] text-[#848E9C]">Immutable cryptographic hash verification</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs tabular-nums">
            <thead>
              <tr className="text-[#848E9C] border-b border-[#23272E] text-[11px] font-semibold">
                <th className="py-2.5 pl-2">Time</th>
                <th className="py-2.5">TxHash</th>
                <th className="py-2.5">Type / Description</th>
                <th className="py-2.5 text-right">Amount</th>
                <th className="py-2.5 text-right">Balance After</th>
                <th className="py-2.5 text-center pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2329]">
              {ledger.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#1E2329]">
                  <td className="py-3 pl-2 text-[#848E9C] font-mono text-[11px]">
                    {formatDate(tx.timestamp)} {formatTimestamp(tx.timestamp)}
                  </td>
                  <td className="py-3 font-mono text-[10px] text-[#848E9C]">
                    {tx.txHash.slice(0, 14)}...
                  </td>
                  <td className="py-3">
                    <div className="text-white font-medium text-xs">{tx.description}</div>
                    {tx.counterparty && (
                      <div className="text-[10px] text-[#848E9C]">Target: {tx.counterparty}</div>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-xs">
                    <span
                      className={
                        tx.type.includes("sent") || tx.type.includes("withdrawal")
                          ? "text-bear"
                          : "text-bull"
                      }
                    >
                      {tx.type.includes("sent") || tx.type.includes("withdrawal") ? "-" : "+"}
                      {formatCurrency(tx.amount, 2, "")} {tx.asset}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-[#848E9C] text-xs">
                    {formatCurrency(tx.balanceAfter, 2, "")}
                  </td>
                  <td className="py-3 text-center pr-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-bull-dim text-bull">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181A20] border border-[#2B313A] rounded-lg shadow-dropdown w-full max-w-md p-5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#2B313A]">
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white text-sm">Instant Internal Transfer</span>
              </div>
              <button
                onClick={() => setTransferModalOpen(false)}
                className="text-[#848E9C] hover:text-white"
              >
                ✕
              </button>
            </div>

            {transferMsg && (
              <div
                className={`my-3 p-2 rounded flex items-center space-x-2 text-[11px] ${
                  transferMsg.success
                    ? "bg-bull-dim text-bull border border-bull/20"
                    : "bg-bear-dim text-bear border border-bear/20"
                }`}
              >
                {transferMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{transferMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleInternalTransfer} className="space-y-4 my-4">
              <div>
                <label className="block text-[#848E9C] mb-1 font-semibold">Recipient UID / Email</label>
                <input
                  type="text"
                  placeholder="e.g. 88299102 or partner@cryptobull.ai"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#F0B90B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#848E9C] mb-1 font-semibold">Asset</label>
                  <select
                    value={transferAsset}
                    onChange={(e) => setTransferAsset(e.target.value)}
                    className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="BNB">BNB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#848E9C] mb-1 font-semibold">Amount</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#F0B90B]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#848E9C] mb-1 font-semibold">Transfer Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Settlement for OTC trade"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full bg-[#0B0E11] border border-[#2B313A] rounded px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="bg-[#0B0E11] p-2.5 rounded border border-[#2B313A] text-[11px] text-[#848E9C] flex justify-between">
                <span>Transfer Fee:</span>
                <span className="text-bull font-bold font-mono">0.00 USDT (Instant)</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-bull hover:bg-bull-hover text-black font-extrabold uppercase tracking-wide transition-colors"
              >
                Sign & Execute Internal Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
