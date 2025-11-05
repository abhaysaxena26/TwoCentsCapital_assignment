import { useEffect, useState, useRef } from "react";

export interface Order {
  price: number;
  amount: number;
}

export interface Trade {
  price: number;
  amount: number;
  side: "buy" | "sell";
  time: number;
}

export const useOrderBook = (symbol: string) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [connected, setConnected] = useState(false);

  const depthSocketRef = useRef<WebSocket | null>(null);
  const tradeSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const depthSocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`
    );
    const tradeSocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`
    );

    depthSocketRef.current = depthSocket;
    tradeSocketRef.current = tradeSocket;

    depthSocket.onopen = () => setConnected(true);
    tradeSocket.onopen = () => setConnected(true);

    depthSocket.onclose = () => setConnected(false);
    tradeSocket.onclose = () => setConnected(false);

    depthSocket.onerror = () => setConnected(false);
    tradeSocket.onerror = () => setConnected(false);

    // Orderbook updates
    depthSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data.bids) && Array.isArray(data.asks)) {
        setBids(
          data.bids
            .slice(0, 15)
            .map(([p, q]: [string, string]) => ({
              price: parseFloat(p),
              amount: parseFloat(q),
            }))
            .filter((b: Order) => b.amount > 0)
        );

        setAsks(
          data.asks
            .slice(0, 15)
            .map(([p, q]: [string, string]) => ({
              price: parseFloat(p),
              amount: parseFloat(q),
            }))
            .filter((a: Order) => a.amount > 0)
        );
      }
    };

    // Trade updates
    tradeSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const trade: Trade = {
        price: parseFloat(data.p),
        amount: parseFloat(data.q),
        side: data.m ? "sell" : "buy",
        time: data.T,
      };
      setTrades((prev) => [trade, ...(prev || [])].slice(0, 50));
    };

    return () => {
      depthSocket.close();
      tradeSocket.close();
    };
  }, [symbol]);

  return { bids, asks, trades, connected };
};
