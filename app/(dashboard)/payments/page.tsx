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
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight leading-none">
            Paiements
          </h2>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
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
      <div className="rounded-[24px] border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden">
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
