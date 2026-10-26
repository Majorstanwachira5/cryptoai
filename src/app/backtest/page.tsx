"use client";

import React, { useState } from "react";
import BacktestWizard from "@/components/backtest/BacktestWizard";
import BacktestResultsView from "@/components/backtest/BacktestResultsView";
import { BacktestResult } from "@/types/backtest";
import { store } from "@/lib/store";

export default function BacktestPage() {
  const [currentResult, setCurrentResult] = useState<BacktestResult | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 select-none">
      <BacktestWizard onBacktestComplete={(res) => setCurrentResult(res)} />
      {currentResult && <BacktestResultsView result={currentResult} />}
    </div>
  );
}
