"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");
  if ((session.user as { role: string }).role !== "ADMIN") {
    throw new Error("Accès réservé aux administrateurs");
  }
  return session;
}

export async function getSettings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const settings = await prisma.settings.findFirst();
  if (!settings) {
    // Create default settings if none exist
    return prisma.settings.create({
      data: {
        schoolName: "Auto-École",
        currency: "MAD",
        currencySymbol: "DH",
        locale: "fr-MA",
      },
    });
  }
  return settings;
}

export async function updateSettings(data: unknown) {
  await getAdminSession();

  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.settings.findFirst();

  if (existing) {
    await prisma.settings.update({
      where: { id: existing.id },
      data: {
        schoolName: parsed.data.schoolName,
        address: parsed.data.address || null,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        currency: parsed.data.currency,
        currencySymbol: parsed.data.currencySymbol,
        locale: parsed.data.language === "AR" ? "ar-MA" : "fr-MA",
      },
    });
  } else {
    await prisma.settings.create({
      data: {
        schoolName: parsed.data.schoolName,
        address: parsed.data.address || null,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        currency: parsed.data.currency,
        currencySymbol: parsed.data.currencySymbol,
        locale: parsed.data.language === "AR" ? "ar-MA" : "fr-MA",
      },
    });
  }

  revalidatePath("/settings");
  revalidatePath("/");

  return { success: true };
}

export async function uploadLogo(formData: FormData) {
  await getAdminSession();

  const file = formData.get("logo") as File;
  if (!file) return { success: false, error: "Aucun fichier fourni" };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Format non supporté (JPG, PNG, WEBP, SVG)" };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: "Le logo ne doit pas dépasser 2MB" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `logo-${Date.now()}.${ext}`;

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const logoUrl = `/uploads/${filename}`;
  const existing = await prisma.settings.findFirst();

  if (existing) {
    await prisma.settings.update({ where: { id: existing.id }, data: { logoUrl } });
  }

  revalidatePath("/settings");
  revalidatePath("/");

  return { success: true, data: { logoUrl } };
}
