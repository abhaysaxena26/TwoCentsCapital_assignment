"use client";

import { useEffect, useRef, useState } from "react";

interface Order {
  price: number;
  amount: number;
}

interface Trade {
  price: number;
  quantity: number;
  side: "buy" | "sell";
}

export function useOrderBook(symbol: string) {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`
    );
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.bids && data.asks) {
        const newBids = data.bids.map((b: [string, string]) => ({
          price: parseFloat(b[0]),
          amount: parseFloat(b[1]),
        }));
        const newAsks = data.asks.map((a: [string, string]) => ({
          price: parseFloat(a[0]),
          amount: parseFloat(a[1]),
        }));

        setBids(newBids);
        setAsks(newAsks);
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
    };
  }, [symbol]);

  // Get trades (optional live trade stream)
  useEffect(() => {
    const tradeSocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
    );

    tradeSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const trade: Trade = {
        price: parseFloat(data.p),
        quantity: parseFloat(data.q),
        side: data.m ? "sell" : "buy",
      };
      setTrades((prev) => [trade, ...prev.slice(0, 50)]); // Keep latest 50
    };

    tradeSocket.onclose = () => {};
    tradeSocket.onerror = () => {};

    return () => {
      tradeSocket.close();
    };
  }, [symbol]);

  return { bids, asks, trades, connected };
}
