"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  FileText,
  UserCog,
  ScrollText,
  Settings,
  Car,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Session } from "next-auth";
import type { AppSettings } from "@/types";

const NAV_ITEMS = [
  { title: "Tableau de bord", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "SECRETARY"] },
  { title: "Élèves", href: "/students", icon: Users, roles: ["ADMIN", "SECRETARY"] },
  { title: "Paiements", href: "/payments", icon: CreditCard, roles: ["ADMIN", "SECRETARY"] },
  { title: "Statistiques", href: "/statistics", icon: BarChart3, roles: ["ADMIN", "SECRETARY"] },
  { title: "Rapports", href: "/reports", icon: FileText, roles: ["ADMIN", "SECRETARY"] },
];

const ADMIN_NAV_ITEMS = [
  { title: "Utilisateurs", href: "/users", icon: UserCog, roles: ["ADMIN"] },
  { title: "Journal d'audit", href: "/audit-logs", icon: ScrollText, roles: ["ADMIN"] },
  { title: "Sauvegarde", href: "/backup", icon: Database, roles: ["ADMIN"] },
  { title: "Paramètres", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

interface SidebarProps {
  session: Session;
  settings: AppSettings | null;
}

export function Sidebar({ session, settings }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const role = (session.user as { role: string }).role;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className="hidden" />

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col h-full bg-sidebar border-r border-sidebar-border relative z-10 flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center">
              <Car className="w-5 h-5 text-sidebar-primary" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0"
                >
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {settings?.schoolName ?? "Auto-École"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">Manager</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-20 w-6 h-6 rounded-full bg-sidebar-border border border-sidebar-border flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors shadow-sm"
          aria-label={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {/* Main nav */}
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                    active
                      ? "bg-sidebar-primary/20 text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-sidebar-primary/15"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 flex-shrink-0 relative z-10", active && "text-sidebar-primary")} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* Admin section */}
          {role === "ADMIN" && (
            <div className="pt-4 mt-4 border-t border-sidebar-border space-y-0.5">
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
                  Administration
                </p>
              )}
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                      active
                        ? "bg-sidebar-primary/20 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-sidebar-primary")} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="truncate"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 border-t border-sidebar-border p-2">
          <div className={cn("flex items-center gap-3 px-2 py-2 rounded-lg", !collapsed && "mb-1")}>
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-sidebar-primary">
                {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="text-xs font-medium text-sidebar-foreground truncate">
                    {session.user?.name ?? "Utilisateur"}
                  </p>
                  <p className="text-[10px] text-sidebar-foreground/50 truncate">
                    {role === "ADMIN" ? "Administrateur" : "Secrétaire"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Se déconnecter" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Se déconnecter
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
