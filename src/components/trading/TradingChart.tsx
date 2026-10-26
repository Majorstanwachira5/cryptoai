"use client";

import React, { useEffect, useRef, useState } from "react";
import { generateCandleHistory } from "@/lib/marketData";
import { KlineCandle } from "@/types/market";
import { BarChart3, Maximize2, RefreshCw } from "lucide-react";

interface TradingChartProps {
  symbol: string;
  currentPrice?: number;
}

export default function TradingChart({ symbol, currentPrice }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>("1h");
  const [showMA, setShowMA] = useState(true);
  const chartInstanceRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let chart: any = null;

    async function initChart() {
      if (!chartContainerRef.current) return;

      try {
        const { createChart, ColorType, CrosshairMode } = await import("lightweight-charts");
        if (!isMounted || !chartContainerRef.current) return;

        // Clear existing chart if any
        if (chartInstanceRef.current) {
          chartInstanceRef.current.remove();
        }

        const container = chartContainerRef.current;
        chart = createChart(container, {
          width: container.clientWidth,
          height: container.clientHeight || 420,
          layout: {
            background: { type: ColorType.Solid, color: "#181A20" },
            textColor: "#848E9C",
            fontSize: 11,
            fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
          },
          grid: {
            vertLines: { color: "#23272E" },
            horzLines: { color: "#23272E" },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              color: "#5E6673",
              width: 1,
              style: 3,
            },
            horzLine: {
              color: "#5E6673",
              width: 1,
              style: 3,
            },
          },
          timeScale: {
            borderColor: "#2B313A",
            timeVisible: true,
            secondsVisible: false,
          },
          rightPriceScale: {
            borderColor: "#2B313A",
            scaleMargins: {
              top: 0.1,
              bottom: 0.2,
            },
          },
        });

        chartInstanceRef.current = chart;

        // Candlestick Series
        const candleSeries = chart.addCandlestickSeries({
          upColor: "#0ECB81",
          downColor: "#F6465D",
          borderVisible: false,
          wickUpColor: "#0ECB81",
          wickDownColor: "#F6465D",
        });
        candleSeriesRef.current = candleSeries;

        // Volume Series at bottom
        const volumeSeries = chart.addHistogramSeries({
          color: "#26a69a",
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "",
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });
        volumeSeriesRef.current = volumeSeries;

        // Load historical data
        const candles = generateCandleHistory(symbol, timeframe, 200);

        candleSeries.setData(
          candles.map((c) => ({
            time: c.time as any,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }))
        );

        volumeSeries.setData(
          candles.map((c) => ({
            time: c.time as any,
            value: c.volume,
            color: c.close >= c.open ? "rgba(14, 203, 129, 0.4)" : "rgba(246, 70, 93, 0.4)",
          }))
        );

        chart.timeScale().fitContent();

        // Responsive resize
        const handleResize = () => {
          if (chart && container) {
            chart.applyOptions({
              width: container.clientWidth,
              height: container.clientHeight,
            });
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (err) {
        console.warn("Lightweight charts initialization notice:", err);
      }
    }

    initChart();

    return () => {
      isMounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [symbol, timeframe]);

  // Live tick update on price change
  useEffect(() => {
    if (candleSeriesRef.current && currentPrice) {
      const nowSec = Math.floor(Date.now() / 1000);
      try {
        candleSeriesRef.current.update({
          time: nowSec as any,
          close: currentPrice,
        });
      } catch (e) {
        // quiet ignore for rapid micro-updates
      }
    }
  }, [currentPrice]);

  const timeframes = ["1m", "15m", "1h", "4h", "1D"];

  return (
    <div className="flex flex-col h-full bg-[#181A20] border-r border-b border-[#2B313A] select-none">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2B313A] bg-[#181A20] text-xs">
        {/* Timeframe buttons */}
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-[#848E9C] mr-1 uppercase font-semibold">Time:</span>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                timeframe === tf
                  ? "bg-[#2B313A] text-[#F0B90B]"
                  : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#1E2329]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Indicators & Actions */}
        <div className="flex items-center space-x-3 text-[#848E9C]">
          <button
            onClick={() => setShowMA(!showMA)}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              showMA ? "text-[#F0B90B] bg-[#2B313A]" : "hover:text-[#EAECEF]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>MA (7, 25, 99)</span>
          </button>
          <div className="text-[10px] text-[#0ECB81] bg-bull-dim px-1.5 py-0.5 rounded font-mono font-bold">
            TradingView Engine
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative flex-1 w-full min-h-[380px]" ref={chartContainerRef} />
    </div>
  );
}
