"use client";

import React, { useMemo, useState, Suspense } from "react";

interface Order {
  price: number;
  amount: number;
  total?: number;
}

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
}

export default function OrderBook({ bids = [], asks = [] }: OrderBookProps) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [connected, setConnected] = useState(true); // fake connection state, since now data comes as props


  const sortedBids = useMemo(() => [...bids].sort((a, b) => b.price - a.price), [bids]);
  const sortedAsks = useMemo(() => [...asks].sort((a, b) => a.price - b.price), [asks]);
  const highestBid = sortedBids[0]?.price || 0;
  const lowestAsk = sortedAsks[0]?.price || 0;
  const spread = (lowestAsk - highestBid).toFixed(2);

  return (
    <div className="bg-[#131c27]/70 border border-[#1e2a36] p-5 rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
          Order Book ({symbol})
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
          {connected ? "Connected" : "Reconnecting..."}
        </div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-[#16202a] border border-[#1e2a36] rounded-lg text-sm text-gray-300 px-3 py-1 focus:outline-none"
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
          <option value="SOLUSDT">SOL/USDT</option>
        </select>
      </div>

      <div className="text-center text-gray-400 mb-3">
        Spread: <span className="text-gray-200">{spread} USDT</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bids */}
        <div>
          <h3 className="text-green-400 text-lg mb-2 font-semibold">Buy Orders</h3>
          <div className="rounded-lg overflow-hidden border border-[#1e2b36]">
            <div className="grid grid-cols-3 text-xs text-gray-400 bg-[#22303d] px-3 py-2">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {sortedBids.map((b, i) => {
                const total = sortedBids.slice(0, i + 1).reduce((a, c) => a + c.amount, 0);
                const max = sortedBids.reduce((a, c) => a + c.amount, 0);
                const width = (total / max) * 100;
                return (
                  <div key={i} className="relative grid grid-cols-3 px-3 py-1 text-green-300">
                    <div
                      className="absolute left-0 top-0 h-full bg-green-500/20"
                      style={{ width: `${width}%` }}
                    />
                    <span>{b.price.toFixed(2)}</span>
                    <span>{b.amount.toFixed(5)}</span>
                    <span>{total.toFixed(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Asks */}
        <div>
          <h3 className="text-red-400 text-lg mb-2 font-semibold">Sell Orders</h3>
          <div className="rounded-lg overflow-hidden border border-[#1e2b36]">
            <div className="grid grid-cols-3 text-xs text-gray-400 bg-[#22303d] px-3 py-2">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {sortedAsks.map((a, i) => {
                const total = sortedAsks.slice(0, i + 1).reduce((a, c) => a + c.amount, 0);
                const max = sortedAsks.reduce((a, c) => a + c.amount, 0);
                const width = (total / max) * 100;
                return (
                  <div key={i} className="relative grid grid-cols-3 px-3 py-1 text-red-300">
                    <div
                      className="absolute left-0 top-0 h-full bg-red-500/20"
                      style={{ width: `${width}%` }}
                    />
                    <span>{a.price.toFixed(2)}</span>
                    <span>{a.amount.toFixed(5)}</span>
                    <span>{total.toFixed(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Depth Chart */}
      <div className="mt-6">
        {/* <Suspense fallback={<div className="text-gray-500 text-center">Loading chart...</div>}>
          <LazyDepthChart bids={sortedBids} asks={sortedAsks} />
        </Suspense> */}
      </div>
    </div>
  );
}
