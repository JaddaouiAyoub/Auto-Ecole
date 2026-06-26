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
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Statistiques & Rapports</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analyse détaillée des performances de l&apos;auto-école.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Year selector form logic would go here, simplified for display */}
          <select 
            className="text-sm bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue={yearParam}
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear - 1}>{currentYear - 1}</option>
            <option value={currentYear - 2}>{currentYear - 2}</option>
          </select>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Élèves Actifs"
          value={stats.activeStudents}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Revenus Mensuels"
          value={formatCurrencyCompact(stats.monthlyRevenue)}
          icon={Banknote}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title="Taux de Recouvrement"
          value={`${stats.collectionRate.toFixed(1)}%`}
          icon={CreditCard}
          iconClassName="bg-purple-500/10 text-purple-500"
          description={`Reste: ${formatCurrencyCompact(stats.totalRemaining)}`}
        />
        <StatCard
          title="Nouvelles Inscriptions"
          value={stats.monthlyRegistrations}
          icon={GraduationCap}
          iconClassName="bg-amber-500/10 text-amber-500"
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
