import { getSettings } from "@/actions/settings";
import { SettingsForm } from "@/components/settings/settings-form";
import { auth } from "@/lib/auth";
import type { SettingsFormData } from "@/lib/validations";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if ((session?.user as { role: string }).role !== "ADMIN") {
    redirect("/"); // Only admin can access settings
  }

  const settings = await getSettings();

  const initialData: SettingsFormData = {
    schoolName: settings?.schoolName || "",
    logoUrl: settings?.logoUrl || undefined,
    address: settings?.address || undefined,
    phone: settings?.phone || undefined,
    email: settings?.email || undefined,
    currency: settings?.currency || "MAD",
    currencySymbol: settings?.currencySymbol || "DH",
    language: settings?.locale === "ar-MA" ? "AR" : "FR",
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70 mb-1">
          Administration
        </p>
        <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">Paramètres</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Configurez les informations de votre auto-école pour les reçus et l&apos;interface.
        </p>
      </div>

      <SettingsForm initialData={initialData} />
    </div>
  );
}
