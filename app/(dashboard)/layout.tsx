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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar session={session} settings={settings} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header session={session} settings={settings} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
