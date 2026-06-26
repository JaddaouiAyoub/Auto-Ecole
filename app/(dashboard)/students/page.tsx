import { getStudents } from "@/actions/students";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { StudentFilters } from "@/types";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status as StudentFilters["status"] : undefined;
  const hasBalanceStr = typeof params.hasBalance === "string" ? params.hasBalance : undefined;
  
  let hasBalance: boolean | undefined = undefined;
  if (hasBalanceStr === "true") hasBalance = true;
  if (hasBalanceStr === "false") hasBalance = false;

  const filters: StudentFilters = {
    search,
    status,
    hasBalance,
    limit: 100, // Load a chunk for now, real app might use infinite scroll or real pagination with server actions
  };

  const { data } = await getStudents(filters);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Gestion des Élèves</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos élèves, leurs statuts et leur progression financière.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <a href={`/api/export?type=students${search ? `&search=${search}` : ""}`} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4" />
              Exporter
            </a>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/students/new">
              <Plus className="w-4 h-4" />
              Nouvel Élève
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={data as any}
        searchKey="firstName"
        searchPlaceholder="Filtrer par prénom..."
      />
    </div>
  );
}
