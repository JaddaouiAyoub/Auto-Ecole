import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getSettings } from "@/actions/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const settings = await getSettings();

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <Sidebar session={session} settings={settings} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <Header session={session} settings={settings} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-8">
          <div className="max-w-[1400px] mx-auto animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
