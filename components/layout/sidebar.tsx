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
  UserCog,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Session } from "next-auth";
import type { AppSettings } from "@/types";

const NAV_ITEMS = [
  { title: "Tableau de bord", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "SECRETARY"] },
  { title: "Candidats", href: "/students", icon: Users, roles: ["ADMIN", "SECRETARY"] },
  { title: "Paiements", href: "/payments", icon: CreditCard, roles: ["ADMIN", "SECRETARY"] },
  { title: "Statistiques", href: "/statistics", icon: BarChart3, roles: ["ADMIN", "SECRETARY"] },
  // { title: "Rapports", href: "/reports", icon: FileText, roles: ["ADMIN", "SECRETARY"] },
];

const ADMIN_NAV_ITEMS = [
  { title: "Utilisateurs", href: "/users", icon: UserCog, roles: ["ADMIN"] },
  { title: "Journal d'audit", href: "/audit-logs", icon: ScrollText, roles: ["ADMIN"] },
  // { title: "Sauvegarde", href: "/backup", icon: Database, roles: ["ADMIN"] },
  { title: "Paramètres", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

interface SidebarProps {
  session: Session;
  settings: AppSettings | null;

  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ session, settings, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const role = (session.user as { role: string }).role;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar/70 backdrop-blur-3xl border border-sidebar-border/50 rounded-2xl shadow-xl overflow-hidden relative",
        mobile && "rounded-none rounded-r-2xl"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border/30 bg-sidebar/50 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 min-w-0 group"
          onClick={mobile ? onMobileClose : undefined}
        >
          {/* Ton SVG ici */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M5.5 14.5l2-5A1.5 1.5 0 019 8.5h6a1.5 1.5 0 011.5 1l2 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M3 14.5h18v3.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3.5z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="7.5" cy="18.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="16.5" cy="18.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <rect x="8.5" y="10" width="7" height="4" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity=".6" />
          </svg>
          <AnimatePresence>
            {(mobile || !collapsed) && (
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

                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest truncate">
                  Manager
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {mobile && (
          <button
            onClick={onMobileClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
                onClick={mobile ? onMobileClose : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 group relative",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
                title={!mobile && collapsed ? item.title : undefined}
              >
                {active && (
                  <motion.div
                    layoutId={mobile ? "activeNavMobile" : "activeNav"}
                    className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/20"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-200",
                    active && "text-primary-foreground"
                  )}
                />

                <AnimatePresence>
                  {(mobile || !collapsed) && (
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

        {/* Administration */}
        {role === "ADMIN" && (
          <div className="pt-5 mt-5 border-t border-sidebar-border/30 space-y-1">
            {(mobile || !collapsed) && (
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
                  onClick={mobile ? onMobileClose : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 group relative",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  )}
                  title={!mobile && collapsed ? item.title : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId={mobile ? "activeAdminMobile" : "activeAdmin"}
                      className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/20"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-200",
                      active && "text-primary-foreground"
                    )}
                  />

                  <AnimatePresence>
                    {(mobile || !collapsed) && (
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

      {/* Profil */}
      <div className="flex-shrink-0 border-t border-sidebar-border/30 p-3 bg-sidebar/50">
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-xl bg-background/50 border border-border/50 shadow-sm",
            (mobile || !collapsed) && "mb-2"
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[13px] font-bold text-primary">
              {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>

          <AnimatePresence>
            {(mobile || !collapsed) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
            !mobile && collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-1 duration-200" />

          <AnimatePresence>
            {(mobile || !collapsed) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate"
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ===================== MOBILE ===================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}

            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
            />

            {/* Drawer */}

            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden"
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===================== DESKTOP ===================== */}

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="hidden md:flex flex-col h-screen relative z-10 flex-shrink-0"
      >
        <div className="h-[calc(100vh-32px)] my-4 ml-4">
          <SidebarContent />
        </div>

        {/* Collapse Button */}

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