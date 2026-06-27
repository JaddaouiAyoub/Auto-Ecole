import { LicenseCategory, PaymentMethod, Role, StudentStatus } from "@/types";

// ─── App Constants ────────────────────────────────────────────────────────────

export const APP_NAME = "Auto-École Manager";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "Système de gestion d'auto-école";

// ─── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Currency ────────────────────────────────────────────────────────────────

export const DEFAULT_CURRENCY = "MAD";
export const DEFAULT_CURRENCY_SYMBOL = "DH";
export const DEFAULT_LOCALE = "fr-MA";

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES: Record<Role, string> = {
  ADMIN: "Administrateur",
  SECRETARY: "Secrétaire",
};

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  SECRETARY: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

// ─── Student Status ───────────────────────────────────────────────────────────

export const STUDENT_STATUS: Record<StudentStatus, string> = {
  ACTIVE: "Actif",
  COMPLETED: "Terminé",
  SUSPENDED: "Suspendu",
};

export const STATUS_FR_AR: Record<StudentStatus, { fr: string; ar: string }> = {
  ACTIVE: { fr: "Actif", ar: "نشط" },
  COMPLETED: { fr: "Terminé", ar: "مكتمل" },
  SUSPENDED: { fr: "Suspendu", ar: "موقوف" },
};

export const STATUS_COLORS: Record<StudentStatus, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  SUSPENDED: "bg-red-500/10 text-red-500 border-red-500/20",
};

// ─── License Categories ───────────────────────────────────────────────────────

export const LICENSE_CATEGORIES: Record<LicenseCategory, string> = {
  A: "Catégorie A — Moto",
  A1: "Catégorie A1 — Moto légère",
  A2: "Catégorie A2 — Moto intermédiaire",
  B: "Catégorie B — Voiture",
  B1: "Catégorie B1 — Véhicule léger 3 roues",
  C: "Catégorie C — Camion",
  D: "Catégorie D — Bus",
  E: "Catégorie E — Remorque",
};

export const LICENSE_CATEGORY_OPTIONS = Object.entries(LICENSE_CATEGORIES).map(
  ([value, label]) => ({ value: value as LicenseCategory, label })
);

// ─── Payment Methods ──────────────────────────────────────────────────────────

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  CASH: "Espèces",
  CARD: "Carte bancaire",
  BANK_TRANSFER: "Virement bancaire",
  CHECK: "Chèque",
};

export const PAYMENT_METHOD_FR_AR: Record<PaymentMethod, { fr: string; ar: string }> = {
  CASH: { fr: "Espèces", ar: "نقداً" },
  CARD: { fr: "Carte bancaire", ar: "بطاقة بنكية" },
  BANK_TRANSFER: { fr: "Virement bancaire", ar: "تحويل بنكي" },
  CHECK: { fr: "Chèque", ar: "شيك" },
};

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHODS).map(
  ([value, label]) => ({ value: value as PaymentMethod, label })
);

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  CASH: "💵",
  CARD: "💳",
  BANK_TRANSFER: "🏦",
  CHECK: "📄",
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  {
    title: "Tableau de bord",
    titleAr: "لوحة القيادة",
    href: "/",
    icon: "LayoutDashboard",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    title: "Candidats",
    titleAr: "الطلاب",
    href: "/students",
    icon: "Users",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    title: "Paiements",
    titleAr: "المدفوعات",
    href: "/payments",
    icon: "CreditCard",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    title: "Statistiques",
    titleAr: "الإحصائيات",
    href: "/statistics",
    icon: "BarChart3",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    title: "Rapports",
    titleAr: "التقارير",
    href: "/reports",
    icon: "FileText",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    title: "Utilisateurs",
    titleAr: "المستخدمون",
    href: "/users",
    icon: "UserCog",
    roles: ["ADMIN"],
  },
  {
    title: "Journal d'audit",
    titleAr: "سجل التدقيق",
    href: "/audit-logs",
    icon: "ScrollText",
    roles: ["ADMIN"],
  },
  {
    title: "Paramètres",
    titleAr: "الإعدادات",
    href: "/settings",
    icon: "Settings",
    roles: ["ADMIN"],
  },
] as const;

// ─── Date Formats ─────────────────────────────────────────────────────────────

export const DATE_FORMAT = "dd/MM/yyyy";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const MONTH_FORMAT = "MMMM yyyy";

// ─── Chart Colors ─────────────────────────────────────────────────────────────

export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  emerald: "#10b981",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#64748b",
};

export const MONTHS_FR = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

// ─── File Upload ──────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const UPLOAD_DIR = "public/uploads";
