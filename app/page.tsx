"use client";

import React, { useMemo, useState } from "react";
import { useOrderBook } from "@/hooks/useOrderBook";
import OrderBook from "@/components/OrderBook";
import Trades from "@/components/Trades";
// import DepthChart from "@/components/DepthChart";

export default function HomePage() {
  const [pair, setPair] = useState("BTCUSDT");
  const { bids, asks, trades} = useOrderBook(pair);

  // compute cumulative totals once and memoize
  const bidsWithTotals = useMemo(() => {
    let run = 0;
    return bids.map((b) => {
      run += b.amount;
      return { ...b, total: run };
    });
  }, [bids]);

  const asksWithTotals = useMemo(() => {
    let run = 0;
    return asks.map((a) => {
      run += a.amount;
      return { ...a, total: run };
    });
  }, [asks]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0f14] to-[#111b24] text-gray-200 px-6 py-8 flex flex-col gap-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 tracking-wide drop-shadow-md">
          BTC/USDT Orderbook Visualizer
        </h1>
        <p className="text-sm text-gray-400">Real-time market data</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Book */}
        <div className="lg:col-span-2 bg-[#131c27]/70 border border-[#1e2a36] backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <OrderBook bids={bidsWithTotals as any} asks={asksWithTotals as any} />

          {/* <DepthChart bids={bidsWithTotals} asks={asksWithTotals} /> */}
        </div>

        {/* Trades */}
        <div className="bg-[#131c27]/70 border border-[#1e2a36] backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Trades trades={trades} />
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 mt-6 border-t border-[#1e2a36] pt-3">
        Powered by Binance WebSocket API
      </footer>
    </main>
  );
}
