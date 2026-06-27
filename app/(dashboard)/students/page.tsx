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
    limit: 100,
  };

  const { data } = await getStudents(filters);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight leading-none">
            Candidats
          </h2>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            Gérez vos Candidats, leurs statuts et leur progression financière.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={`/api/export?type=students${search ? `&search=${search}` : ""}`} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4" />
              Exporter
            </a>
          </Button>
          <Button size="sm" className="gap-2" asChild>
            <Link href="/students/new">
              <Plus className="w-4 h-4" />
              Nouvel élève
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-[24px] border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data as any}
          searchKey="firstName"
          searchPlaceholder="Filtrer par prénom..."
        />
      </div>
    </div>
  );
}
