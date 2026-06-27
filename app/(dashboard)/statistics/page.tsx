import { getMonthlyStats, getDashboardStats } from "@/actions/students";
import { getPaymentMethodStats } from "@/actions/payments";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, GraduationCap, Banknote, CreditCard } from "lucide-react";
import { formatCurrencyCompact } from "@/lib/utils";

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const yearParam = typeof params.year === "string" ? parseInt(params.year) : currentYear;

  const [stats, monthlyData, paymentMethodData] = await Promise.all([
    getDashboardStats(),
    getMonthlyStats(yearParam),
    getPaymentMethodStats(yearParam),
  ]);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-1">
            Analyse
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">
            Statistiques
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Analyse détaillée des performances de l&apos;auto-école.
          </p>
        </div>
        <select 
          className="text-sm bg-secondary border border-border/60 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring self-start sm:self-auto"
          defaultValue={yearParam}
        >
          <option value={currentYear}>{currentYear}</option>
          <option value={currentYear - 1}>{currentYear - 1}</option>
          <option value={currentYear - 2}>{currentYear - 2}</option>
        </select>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Élèves actifs"
          value={stats.activeStudents}
          numericValue={stats.activeStudents}
          icon={<Users className="w-5 h-5 text-blue-500" />}
          iconClassName="bg-blue-500/10"
          delay={0.05}
        />
        <StatCard
          title="Revenus du mois"
          value={formatCurrencyCompact(stats.monthlyRevenue)}
          icon={<Banknote className="w-5 h-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          delay={0.1}
        />
        <StatCard
          title="Taux de recouvrement"
          value={`${stats.collectionRate.toFixed(1)}%`}
          icon={<CreditCard className="w-5 h-5 text-violet-500" />}
          iconClassName="bg-violet-500/10"
          description={`Reste: ${formatCurrencyCompact(stats.totalRemaining)}`}
          delay={0.15}
        />
        <StatCard
          title="Nouvelles inscriptions"
          value={stats.monthlyRegistrations}
          numericValue={stats.monthlyRegistrations}
          icon={<GraduationCap className="w-5 h-5 text-amber-500" />}
          iconClassName="bg-amber-500/10"
          delay={0.2}
        />
      </div>

      {/* Charts */}
      <StatisticsCharts 
        monthlyData={monthlyData} 
        paymentMethodData={paymentMethodData} 
      />
    </div>
  );
}
