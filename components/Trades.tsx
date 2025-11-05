"use client";

import React from "react";

interface Trade {
  price: number;
  quantity: number;
  side: "buy" | "sell";
}

export default function Trades({ trades = [] }: { trades: Trade[] }) {
  return (
    <div className="bg-[#131c27]/70 border border-[#1e2a36] p-5 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
        Live Trades
      </h2>
      <div className="rounded-lg overflow-hidden border border-[#1e2b36]">
        <div className="grid grid-cols-3 text-xs text-gray-400 bg-[#22303d] px-3 py-2">
          <span>Price (USDT)</span>
          <span>Quantity</span>
          <span>Side</span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {trades.map((t, i) => {
            if (!t || isNaN(t.price) || isNaN(t.quantity)) return null; // ✅ skip malformed trades
            return (
              <div
                key={i}
                className={`grid grid-cols-3 px-3 py-1 text-sm ${
                  t.side === "buy" ? "text-green-400" : "text-red-400"
                }`}
              >
                <span>{t.price.toFixed(2)}</span>
                <span>{t.quantity.toFixed(5)}</span>
                <span className="capitalize">{t.side}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
