import { getUsers, toggleUserStatus, deleteUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Plus, Shield, User, CheckCircle, XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function UsersPage() {
  const session = await auth();
  if ((session?.user as { role: string }).role !== "ADMIN") {
    redirect("/"); // Or show Unauthorized
  }

  const users = await getUsers();

  async function handleToggle(id: string, isActive: boolean) {
    "use server";
    await toggleUserStatus(id, isActive);
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteUser(id);
  }

  return (
    <div className="space-y-6 pb-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-1">
            Administration
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">Utilisateurs</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Gérez les accès de votre personnel à l&apos;application.
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      u.role === "ADMIN" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary text-secondary-foreground border border-border"
                    }`}>
                      {u.role === "ADMIN" ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      u.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}>
                      {u.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {u.isActive ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {u.id !== session?.user?.id && (
                      <>
                        <form action={handleToggle.bind(null, u.id, !u.isActive)} className="inline-block">
                          <Button variant="outline" size="sm" type="submit" className="text-xs h-8">
                            {u.isActive ? "Désactiver" : "Activer"}
                          </Button>
                        </form>
                        <form action={handleDelete.bind(null, u.id)} className="inline-block">
                          <Button variant="outline" size="sm" type="submit" className="text-xs h-8 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            Supprimer
                          </Button>
                        </form>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
