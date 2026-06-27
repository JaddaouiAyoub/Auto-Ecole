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
    <div className="space-y-12 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight leading-none">
            Tableau de bord
          </h2>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            Performances globales de votre auto-école pour {currentYear}.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-card/50 border border-border/40 px-4 py-2 rounded-xl shadow-sm backdrop-blur-md">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Taux de recouvrement: <strong className="text-primary">{stats.collectionRate.toFixed(1)}%</strong></span>
        </div>
      </div>

      {/* KPI Cards — staggered by delay prop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Candidats actifs"
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

      {/* Charts & Lists Grid (Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-[24px] border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Évolution des revenus</h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Analyse mensuelle pour {currentYear}</p>
            </div>
            <select className="text-sm font-medium bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-shadow cursor-pointer">
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
            </select>
          </div>
          <div className="flex-1 min-h-[350px] relative z-10">
            <RevenueChart data={monthlyData} />
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="space-y-8 flex flex-col">
          {/* Recent Payments */}
          <div className="flex-1 rounded-[24px] border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-base font-bold text-foreground tracking-tight">Derniers paiements</h3>
              <Link
                href="/payments"
                className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group"
              >
                Voir tout{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative z-10">
              <RecentPayments payments={recentPayments} />
            </div>
          </div>

          {/* Students with Balance */}
          <div className="flex-1 rounded-[24px] border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-base font-bold text-foreground tracking-tight">Soldes impayés</h3>
              <Link
                href="/students?hasBalance=true"
                className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group"
              >
                Gérer{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative z-10">
              <StudentsWithBalance students={studentsWithBalance} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
