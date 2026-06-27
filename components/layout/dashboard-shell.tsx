"use client";

import { useState } from "react";
import type { Session } from "next-auth";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

import type { AppSettings } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  session: Session;
  settings: AppSettings | null;
}

export function DashboardShell({
  children,
  session,
  settings,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

      <Sidebar
        session={session}
        settings={settings}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <Header
          session={session}
          settings={settings}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-8">
          <div className="max-w-[1400px] mx-auto animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}