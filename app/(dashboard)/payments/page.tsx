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
    limit: 100, // Load a chunk for now
  };

  const { data } = await getPayments(filters);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Paiements & Reçus</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les encaissements, consultez l&apos;historique et générez des reçus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <a href={`/api/export?type=payments${search ? `&search=${search}` : ""}`} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4" />
              Exporter
            </a>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/payments/new">
              <Plus className="w-4 h-4" />
              Nouveau Paiement
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={data as any}
        searchKey="receiptNumber"
        searchPlaceholder="Rechercher un reçu..."
      />
    </div>
  );
}
