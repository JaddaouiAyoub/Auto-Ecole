"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search, Bell, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "next-auth";
import type { AppSettings } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/": "Tableau de bord",
  "/students": "Gestion des Candidats",
  "/payments": "Paiements",
  "/statistics": "Statistiques",
  "/reports": "Rapports",
  "/users": "Utilisateurs",
  "/audit-logs": "Journal d'audit",
  "/settings": "Paramètres",
  "/backup": "Sauvegarde",
};

interface HeaderProps {
  session: Session;
  settings: AppSettings | null;
  onMobileMenuOpen: () => void;
}

export function Header({
  session,
  settings,
  onMobileMenuOpen,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) =>
      key === "/" ? pathname === "/" : pathname.startsWith(key)
    )?.[1] ?? "Auto-École Manager";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(
      `/students?search=${encodeURIComponent(searchQuery.trim())}`
    );

    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="flex items-center justify-between h-20 px-4 md:px-8 bg-background/40 backdrop-blur-md border-b border-border/20 sticky top-0 z-30 flex-shrink-0">

        {/* Left */}

        <div className="flex items-center gap-4">

          {/* Mobile Menu */}

          <button
            onClick={onMobileMenuOpen}
            className="md:hidden w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              {pageTitle}
            </h1>

            <p className="hidden sm:block text-xs text-muted-foreground">
              {settings?.schoolName ?? "Auto-École Manager"}
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-2">

          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "hidden sm:flex items-center gap-2",
              "px-3 py-1.5 rounded-lg",
              "border border-border",
              "text-sm text-muted-foreground",
              "hover:bg-muted transition-colors"
            )}
          >
            <Search className="w-4 h-4" />

            <span className="hidden md:inline">
              Rechercher...
            </span>

            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-muted-foreground/10 px-1.5 py-0.5 rounded">
              ⌘ K
            </kbd>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>

          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-border">

            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            </div>

            <div className="hidden lg:block">
              <p className="text-xs font-medium">
                {session.user?.name ?? "Utilisateur"}
              </p>

              <p className="text-[10px] text-muted-foreground">
                {(session.user as { role: string }).role === "ADMIN"
                  ? "Admin"
                  : "Secrétaire"}
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* Search Modal */}

      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery("");
          }}
        >
          <div className="flex justify-center pt-[20vh] px-4">

            <motion.div
              initial={{ opacity: 0, scale: .95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl border border-border shadow-card-lg overflow-hidden"
            >
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">

                  <Search className="w-5 h-5 text-muted-foreground" />

                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un élève..."
                    className="flex-1 bg-transparent focus:outline-none"
                  />

                  <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                    ESC
                  </kbd>

                </div>
              </form>

              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Appuyez sur Entrée pour lancer la recherche.
                </p>
              </div>

            </motion.div>

          </div>
        </motion.div>
      )}
    </>
  );
}