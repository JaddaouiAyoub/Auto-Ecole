import { getDashboardStats, getMonthlyStats } from "@/actions/students";
import { getRecentPayments, getStudentsWithBalance } from "@/actions/payments";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { StudentsWithBalance } from "@/components/dashboard/students-with-balance";
import { Users, GraduationCap, Banknote, PiggyBank, ArrowRight, TrendingUp } from "lucide-react";
import { formatCurrencyCompact } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const currentYear = new Date().getFullYear();
  
  const [stats, monthlyData, recentPayments, studentsWithBalance] = await Promise.all([
    getDashboardStats(),
    getMonthlyStats(currentYear),
    getRecentPayments(5),
    getStudentsWithBalance(5),
  ]);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-1">
            Vue d&apos;ensemble
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">
            Tableau de bord
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Performances de votre auto-école — {currentYear}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 border border-border/50 px-3 py-1.5 rounded-full">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span>Taux de recouvrement: <strong className="text-foreground">{stats.collectionRate.toFixed(1)}%</strong></span>
        </div>
      </div>

      {/* KPI Cards — staggered by delay prop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Élèves actifs"
          value={stats.activeStudents}
          numericValue={stats.activeStudents}
          icon={<Users className="w-5 h-5 text-blue-500" />}
          description={`${stats.totalStudents} au total`}
          delay={0.05}
          iconClassName="bg-blue-500/10 group-hover:bg-blue-500/15"
        />
        <StatCard
          title="Inscrits ce mois"
          value={stats.monthlyRegistrations}
          numericValue={stats.monthlyRegistrations}
          icon={<GraduationCap className="w-5 h-5 text-violet-500" />}
          delay={0.1}
          iconClassName="bg-violet-500/10 group-hover:bg-violet-500/15"
        />
        <StatCard
          title="Revenus du mois"
          value={formatCurrencyCompact(stats.monthlyRevenue)}
          icon={<Banknote className="w-5 h-5 text-emerald-500" />}
          delay={0.15}
          iconClassName="bg-emerald-500/10 group-hover:bg-emerald-500/15"
        />
        <StatCard
          title="Reste à percevoir"
          value={formatCurrencyCompact(stats.totalRemaining)}
          icon={<PiggyBank className="w-5 h-5 text-amber-500" />}
          delay={0.2}
          iconClassName="bg-amber-500/10 group-hover:bg-amber-500/15"
        />
      </div>

      {/* Charts & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] p-6 flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground leading-none">Évolution des revenus</h3>
              <p className="text-xs text-muted-foreground mt-1.5">Revenus mensuels — {currentYear}</p>
            </div>
            <select className="text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring text-muted-foreground">
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <RevenueChart data={monthlyData} />
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="space-y-6">
          {/* Recent Payments */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Derniers paiements</h3>
              <Link
                href="/payments"
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group"
              >
                Voir tout{" "}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <RecentPayments payments={recentPayments} />
          </div>

          {/* Students with Balance */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Soldes impayés</h3>
              <Link
                href="/students?hasBalance=true"
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group"
              >
                Gérer{" "}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <StudentsWithBalance students={studentsWithBalance} />
          </div>
        </div>
      </div>
    </div>
  );
}
