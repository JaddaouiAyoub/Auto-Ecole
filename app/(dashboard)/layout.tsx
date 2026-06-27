import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const settings = await getSettings();

  return (
    <DashboardShell
      session={session}
      settings={settings}
    >
      {children}
    </DashboardShell>
  );
}