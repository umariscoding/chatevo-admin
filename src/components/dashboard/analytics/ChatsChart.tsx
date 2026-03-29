"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Icons } from "@/components/ui";
import type { ChatsTimePoint } from "@/interfaces/Analytics.interface";

interface ChatsChartProps {
  data: ChatsTimePoint[];
  loading?: boolean;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 shadow-xl">
      <p className="text-[11px] text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-amber-300">
        {payload[0].value?.toLocaleString()} chats
      </p>
    </div>
  );
};

const ChatsChart: React.FC<ChatsChartProps> = ({
  data,
  loading = false,
  className = "",
}) => {
  const chartData = data.map((point) => {
    const dateParts = point.date.split("-");
    const localDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
    return {
      date: localDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      "New Chats": point.newChats || 0,
    };
  });

  const total = chartData.reduce((sum, p) => sum + p["New Chats"], 0);

  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 p-5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-50">
            <Icons.MessageSquare className="h-4 w-4 text-accent-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-[-0.01em]">Chat Activity</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">New conversations — last 7 days</p>
          </div>
        </div>
        <div className="text-right">
          {loading ? (
            <div className="w-14 h-6 rounded-lg bg-slate-100 animate-pulse" />
          ) : (
            <>
              <p className="text-xl font-bold text-slate-900 tracking-[-0.03em]">{total.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 font-medium">total</p>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-52 rounded-lg bg-slate-50 animate-pulse" />
      ) : (
        <div className="h-52 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chatAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c4a882" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#c4a882" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#cbd5e1"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#cbd5e1"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(v) => v === 0 ? "0" : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 2" }} />
              <Area
                type="monotone"
                dataKey="New Chats"
                stroke="#b0926a"
                strokeWidth={2.5}
                fill="url(#chatAreaGrad)"
                dot={{ r: 3.5, fill: "#b0926a", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#9a7d56", strokeWidth: 2, stroke: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChatsChart;
