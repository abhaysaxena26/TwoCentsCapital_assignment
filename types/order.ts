export type Side = "buy" | "sell";

export interface Order {
  price: number;
  amount: number;
  total?: number; // cumulative total (optional)
}

export interface Trade {
  price: number;
  amount: number;
  side: Side;
  time: number; // epoch ms
}
