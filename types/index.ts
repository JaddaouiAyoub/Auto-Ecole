// Core application types

export type Role = "ADMIN" | "SECRETARY";

export type StudentStatus = "ACTIVE" | "COMPLETED" | "SUSPENDED";

export type LicenseCategory = "A" | "A1" | "A2" | "B" | "B1" | "C" | "D" | "E";

export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "CHECK";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "RESTORE" | "EXPORT";

// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Student ─────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  phone: string;
  address: string | null;
  email: string | null;
  birthDate: Date | null;
  registrationDate: Date;
  licenseCategory: LicenseCategory;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paymentPercentage: number;
  status: StudentStatus;
  photoUrl: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  payments?: Payment[];
  notes?: Note[];
}

export type StudentWithCounts = Student & {
  _count: {
    payments: number;
    notes: number;
  };
};

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  description: string | null;
  receiptNumber: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
  createdBy?: User;
}

// ─── Note ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  studentId: string;
  content: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
  createdBy?: User;
}

// ─── AuditLog ────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string | null;
  action: AuditAction;
  entity: string;
  entityId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  user?: User | null;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  id: string;
  schoolName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  currency: string;
  currencySymbol: string;
  locale: string;
  theme: string;
  updatedAt: Date;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  suspendedStudents: number;
  totalRevenue: number;
  totalRemaining: number;
  monthlyRevenue: number;
  monthlyRegistrations: number;
  collectionRate: number;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  registrations: number;
  payments: number;
}

export interface StudentBalanceData {
  name: string;
  remaining: number;
  paid: number;
  total: number;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface StudentFormData {
  firstName: string;
  lastName: string;
  cin: string;
  phone: string;
  address?: string;
  email?: string;
  birthDate?: Date;
  licenseCategory: LicenseCategory;
  totalPrice: number;
  status?: StudentStatus;
}

export interface PaymentFormData {
  studentId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  description?: string;
}

// ─── Table / Filter Types ────────────────────────────────────────────────────

export interface StudentFilters {
  search?: string;
  status?: StudentStatus;
  licenseCategory?: LicenseCategory;
  dateFrom?: Date;
  dateTo?: Date;
  hasBalance?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentFilters {
  search?: string;
  studentId?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}
