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

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col h-screen bg-transparent relative z-10 flex-shrink-0"
      >
        <div className="flex flex-col h-[calc(100vh-32px)] my-4 ml-4 bg-sidebar/70 backdrop-blur-3xl border border-sidebar-border/50 rounded-2xl shadow-xl overflow-hidden relative">
          
          {/* Logo Section */}
          <div className="flex items-center h-16 px-4 border-b border-sidebar-border/30 flex-shrink-0 relative z-20 bg-sidebar/50">
            <Link href="/" className="flex items-center gap-3 min-w-0 group">
              <div className="flex-shrink-0 w-9 h-9 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                <Car className="w-5 h-5 text-primary" />
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
                    <p className="text-sm font-bold text-foreground tracking-tight truncate">
                      {settings?.schoolName ?? "Auto-École"}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest truncate">Manager</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1 scrollbar-hide">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 group relative",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/20"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-200", active && "text-primary-foreground")} />
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
              <div className="pt-5 mt-5 border-t border-sidebar-border/30 space-y-1">
                {!collapsed && (
                  <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
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
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 group relative",
                        active
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/20"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("w-4 h-4 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-200", active && "text-primary-foreground")} />
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
            )}
          </nav>

          {/* User Profile Section */}
          <div className="flex-shrink-0 border-t border-sidebar-border/30 p-3 bg-sidebar/50">
            <div className={cn("flex items-center gap-3 px-2 py-2 rounded-xl bg-background/50 border border-border/50 shadow-sm", !collapsed && "mb-2")}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-bold text-primary">
                  {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                </span>
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="min-w-0 flex-1 overflow-hidden"
                  >
                    <p className="text-[13px] font-semibold text-foreground truncate">
                      {session.user?.name ?? "Utilisateur"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate font-medium">
                      {role === "ADMIN" ? "Admin" : "Secrétaire"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 group",
                collapsed && "justify-center"
              )}
              title={collapsed ? "Se déconnecter" : undefined}
            >
              <LogOut className="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-1 duration-200" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                    Déconnexion
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Floating Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-30 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:shadow-md transition-all shadow-sm group"
          aria-label={collapsed ? "Développer" : "Réduire"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 group-hover:translate-x-[1px] transition-transform" />
          ) : (
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-[1px] transition-transform" />
          )}
        </button>
      </motion.aside>
    </>
  );
}
