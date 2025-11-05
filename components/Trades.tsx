"use client";
import { motion } from "framer-motion";
import { Trade } from "../hooks/useOrderBook";

interface TradesProps {
  trades: Trade[];
}

export default function Trades({ trades = [] }: TradesProps) {
  if (!trades || trades.length === 0)
    return (
      <div className="text-gray-500 text-center py-10">
        No recent trades yet...
      </div>
    );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-center text-blue-300">
        Recent Trades
      </h3>
      <div className="grid grid-cols-3 text-xs text-gray-400 bg-[#22303d] px-3 py-2">
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>
      <div className="max-h-105 overflow-y-auto">
        {trades.map((t, i) => (
          <motion.div
            key={i}
            initial={{
              backgroundColor: t.side === "buy" ? "#064e3b" : "#7f1d1d",
            }}
            animate={{ backgroundColor: "transparent" }}
            transition={{ duration: 0.8 }}
            className={`grid grid-cols-3 text-sm px-3 py-1 border-b border-[#1e2a36] ${
              t.side === "buy" ? "text-green-400" : "text-red-400"
            }`}
          >
            <span>{t.price.toFixed(2)}</span>
            <span>{t.amount.toFixed(5)}</span>
            <span className="text-gray-400">
              {new Date(t.time).toLocaleTimeString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
