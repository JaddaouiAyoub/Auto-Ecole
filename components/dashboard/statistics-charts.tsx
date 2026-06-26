"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrencyCompact } from "@/lib/utils";
import { MONTHS_FR, CHART_COLORS, PAYMENT_METHODS } from "@/constants";

interface MonthlyStat {
  month: number;
  revenue: number;
  registrations: number;
}

interface PaymentMethodStat {
  name: string;
  value: number;
}

interface StatisticsChartsProps {
  monthlyData: MonthlyStat[];
  paymentMethodData: PaymentMethodStat[];
}

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.emerald,
  "#f59e0b",
];

export function StatisticsCharts({ monthlyData, paymentMethodData }: StatisticsChartsProps) {
  const { theme } = useTheme();

  const formattedMonthlyData = monthlyData.map((item) => ({
    ...item,
    monthName: MONTHS_FR[item.month],
  }));

  const formattedPaymentMethodData = paymentMethodData.map((item) => ({
    ...item,
    name: PAYMENT_METHODS[item.name as keyof typeof PAYMENT_METHODS] || item.name,
  }));

  const isDark = theme === "dark";
  const textColor = isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const gridColor = isDark ? "hsl(var(--border))" : "hsl(var(--border))";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registrations Bar Chart */}
      <div className="glass rounded-2xl border border-border p-6 shadow-card-sm flex flex-col h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Inscriptions Annuelles</h3>
          <p className="text-sm text-muted-foreground">Nombre d&apos;inscriptions par mois</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  color: "hsl(var(--foreground))",
                  fontSize: "13px",
                }}
              />
              <Bar
                dataKey="registrations"
                name="Inscriptions"
                fill={CHART_COLORS.secondary}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods Pie Chart */}
      <div className="glass rounded-2xl border border-border p-6 shadow-card-sm flex flex-col h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Modes de Paiement</h3>
          <p className="text-sm text-muted-foreground">Répartition des encaissements par mode</p>
        </div>
        <div className="flex-1 min-h-0">
          {formattedPaymentMethodData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedPaymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {formattedPaymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrencyCompact(Number(value)), "Montant"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Aucune donnée de paiement disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
