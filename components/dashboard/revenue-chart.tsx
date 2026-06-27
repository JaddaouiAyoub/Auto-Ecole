"use client";

import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrencyCompact } from "@/lib/utils";
import { MONTHS_FR, CHART_COLORS } from "@/constants";

interface RevenueChartProps {
  data: {
    month: number;
    revenue: number;
    registrations: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme();

  const formattedData = data.map((item) => ({
    ...item,
    monthName: MONTHS_FR[item.month],
  }));

  const isDark = theme === "dark";
  const textColor = isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const gridColor = isDark ? "hsl(var(--border))" : "hsl(var(--border))";

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.5} />
          <XAxis
            dataKey="monthName"
            stroke={textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke={textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrencyCompact(value)}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "12px",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              color: "hsl(var(--foreground))",
              fontSize: "13px",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: any) => [`${Number(value).toLocaleString("fr-MA")} DH`, "Revenus"]}
            labelFormatter={(label) => `Mois: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 6, strokeWidth: 0, fill: CHART_COLORS.primary }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
