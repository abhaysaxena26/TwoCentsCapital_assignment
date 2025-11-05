// "use client";
// import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { Order } from "../hooks/useOrderBook";

// interface Props {
//   bids: Order[];
//   asks: Order[];
// }

// export default function DepthChart({ bids = [], asks = [] }: Props) {
//   const bidData = bids.map((b, i) => ({
//     price: b.price,
//     depth: bids.slice(0, i + 1).reduce((a, c) => a + c.amount, 0),
//   }));

//   const askData = asks.map((a, i) => ({
//     price: a.price,
//     depth: asks.slice(0, i + 1).reduce((a, c) => a + c.amount, 0),
//   }));

//   return (
//     <div className="h-64 bg-[#0d141b] rounded-lg border border-[#1e2a36] p-3">
//       <h3 className="text-center text-gray-300 mb-2 text-sm">Depth Chart</h3>
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart>
//           <XAxis dataKey="price" type="number" domain={["auto", "auto"]} />
//           <YAxis dataKey="depth" />
//           <Tooltip />
//           <Area data={bidData} dataKey="depth" stroke="#22c55e" fill="#22c55e40" />
//           <Area data={askData} dataKey="depth" stroke="#ef4444" fill="#ef444440" />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
