import { z } from "zod";

// ─── Student Schemas ──────────────────────────────────────────────────────────

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  cin: z
    .string()
    .min(5, "Le CIN doit contenir au moins 5 caractères")
    .max(20, "Le CIN ne peut pas dépasser 20 caractères")
    .regex(/^[A-Z0-9]+$/i, "Le CIN ne peut contenir que des lettres et des chiffres"),
  phone: z
    .string()
    .min(8, "Le téléphone doit contenir au moins 8 chiffres")
    .max(15, "Le téléphone ne peut pas dépasser 15 chiffres")
    .regex(/^[0-9+\s-]+$/, "Format de téléphone invalide"),
  address: z.string().max(200, "L'adresse ne peut pas dépasser 200 caractères").optional().or(z.literal("")),
  email: z.string().email("Format d'email invalide").optional().or(z.literal("")),
  birthDate: z.date().optional().nullable(),
  licenseCategory: z.enum(["A", "A1", "A2", "B", "B1", "C", "D", "E"] as const, "La catégorie de permis est requise"),
  totalPrice: z
    .number()
    .min(0, "Le prix doit être positif")
    .max(999999, "Le prix est trop élevé"),
  status: z.enum(["ACTIVE", "COMPLETED", "SUSPENDED"]).default("ACTIVE"),
});

export type StudentFormData = z.input<typeof studentSchema>;

// ─── Payment Schemas ──────────────────────────────────────────────────────────

export const paymentSchema = z.object({
  studentId: z.string().min(1, "L'élève est requis"),
  amount: z
    .number()
    .min(1, "Le montant doit être supérieur à 0")
    .max(999999, "Le montant est trop élevé"),
  paymentDate: z.date("La date est requise"),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "CHECK"] as const, "Le mode de paiement est requis"),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères").optional().or(z.literal("")),
});

export type PaymentFormData = z.input<typeof paymentSchema>;

// ─── User Schemas ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  role: z.enum(["ADMIN", "SECRETARY"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "SECRETARY"]).optional(),
  isActive: z.boolean().optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .optional()
    .or(z.literal("")),
});

export type CreateUserFormData = z.input<typeof createUserSchema>;
export type UpdateUserFormData = z.input<typeof updateUserSchema>;

// ─── Settings Schemas ─────────────────────────────────────────────────────────

export const settingsSchema = z.object({
  schoolName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  address: z.string().max(200).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Format d'email invalide").optional().or(z.literal("")),
  currency: z.string().min(1, "La devise est requise").default("MAD"),
  currencySymbol: z.string().min(1, "Le symbole est requis").default("DH"),
  language: z.enum(["FR", "AR"] as const, "La langue est invalide").default("FR"),
  logoUrl: z.string().url("Format d'URL invalide").optional().or(z.literal("")),
});

export type SettingsFormData = z.input<typeof settingsSchema>;

// ─── Note Schema ──────────────────────────────────────────────────────────────

export const noteSchema = z.object({
  content: z
    .string()
    .min(1, "La note ne peut pas être vide")
    .max(1000, "La note ne peut pas dépasser 1000 caractères"),
});

export type NoteFormData = z.input<typeof noteSchema>;

// ─── Search & Filter Schemas ──────────────────────────────────────────────────

export const studentFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "SUSPENDED"]).optional(),
  licenseCategory: z.enum(["A", "A1", "A2", "B", "B1", "C", "D", "E"]).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  hasBalance: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type StudentFilterData = z.infer<typeof studentFilterSchema>;
