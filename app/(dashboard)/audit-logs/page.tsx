import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { ShieldAlert, PlusCircle, Pencil, Trash2 } from "lucide-react";

export default async function AuditLogsPage() {
  const session = await auth();
  if ((session?.user as { role: string }).role !== "ADMIN") {
    redirect("/"); // Only admin can access audit logs
  }

  // Fetch recent audit logs
  const logs = await db.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE": return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case "UPDATE": return <Pencil className="w-4 h-4 text-amber-500" />;
      case "DELETE": return <Trash2 className="w-4 h-4 text-destructive" />;
      default: return <ShieldAlert className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
      case "UPDATE": return "text-amber-600 bg-amber-500/10 border-amber-500/20";
      case "DELETE": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="space-y-6 pb-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-1">
            Administration
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">Journal d&apos;Audit</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Trace complète des actions effectuées sur le système (100 dernières entrées).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Heure</th>
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Entité</th>
                <th className="px-6 py-4 font-semibold">Détails techniques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{log.user?.name || "Système"}</div>
                    <div className="text-xs text-muted-foreground">{log.user?.email || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{log.entity}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]" title={log.entityId || undefined}>
                      ID: {log.entityId || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-muted-foreground space-y-1">
                      {log.ipAddress && <p>IP: <span className="font-mono">{log.ipAddress}</span></p>}
                      <div className="max-w-xs truncate" title={JSON.stringify(log.newValues || log.oldValues)}>
                        Données: {JSON.stringify(log.newValues || log.oldValues)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Aucune entrée dans le journal d&apos;audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
