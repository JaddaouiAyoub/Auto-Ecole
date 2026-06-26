import { getDashboardStats, getMonthlyStats } from "@/actions/students";
import { getRecentPayments, getStudentsWithBalance } from "@/actions/payments";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { StudentsWithBalance } from "@/components/dashboard/students-with-balance";
import { Users, GraduationCap, Banknote, PiggyBank, ArrowRight } from "lucide-react";
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
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Vue d&apos;ensemble</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Statistiques et performances de votre auto-école pour l&apos;année {currentYear}.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Élèves Actifs"
          value={stats.activeStudents}
          icon={<Users className="w-5 h-5 text-primary" />}
          description={`${stats.totalStudents} élèves au total`}
          delay={0.1}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Nouveaux Inscrits (Mois)"
          value={stats.monthlyRegistrations}
          icon={<GraduationCap className="w-5 h-5 text-primary" />}
          delay={0.2}
          iconClassName="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Revenus (Mois)"
          value={formatCurrencyCompact(stats.monthlyRevenue)}
          icon={<Banknote className="w-5 h-5 text-primary" />}
          delay={0.3}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title="Reste à percevoir"
          value={formatCurrencyCompact(stats.totalRemaining)}
          icon={<PiggyBank className="w-5 h-5 text-primary" />}
          description={`Taux de recouvrement: ${stats.collectionRate.toFixed(1)}%`}
          delay={0.4}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Charts & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass rounded-2xl border border-border shadow-card-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Évolution des Revenus</h3>
              <p className="text-sm text-muted-foreground">Revenus mensuels vs inscriptions</p>
            </div>
            <select className="text-sm bg-secondary border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring">
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
            </select>
          </div>
          <div className="flex-1 min-h-[350px]">
            <RevenueChart data={monthlyData} />
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="space-y-6">
          {/* Recent Payments */}
          <div className="glass rounded-2xl border border-border shadow-card-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Derniers Paiements</h3>
              <Link
                href="/payments"
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <RecentPayments payments={recentPayments} />
          </div>

          {/* Students with Balance */}
          <div className="glass rounded-2xl border border-border shadow-card-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Soldes Impayés</h3>
              <Link
                href="/students?hasBalance=true"
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                Gérer <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <StudentsWithBalance students={studentsWithBalance} />
          </div>
        </div>
      </div>
    </div>
  );
}
