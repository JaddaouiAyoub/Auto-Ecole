import { getPayments } from "@/actions/payments";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { PaymentFilters } from "@/types";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const search = typeof params.search === "string" ? params.search : undefined;

  const filters: PaymentFilters = {
    search,
    limit: 100,
  };

  const { data } = await getPayments(filters);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-1">
            Finances
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">
            Paiements
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Gérez les encaissements, consultez l&apos;historique et générez des reçus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={`/api/export?type=payments${search ? `&search=${search}` : ""}`} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4" />
              Exporter
            </a>
          </Button>
          <Button size="sm" className="gap-2" asChild>
            <Link href="/payments/new">
              <Plus className="w-4 h-4" />
              Nouveau paiement
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] overflow-hidden">
        <DataTable
          columns={columns}
          data={data as any}
          searchKey="receiptNumber"
          searchPlaceholder="Rechercher un reçu..."
        />
      </div>
    </div>
  );
}
