"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  // Prevent self-deactivation
  if (id === session.user.id) {
    return { success: false, error: "Vous ne pouvez pas désactiver votre propre compte" };
  }

  await db.user.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  if (id === session.user.id) {
    return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte" };
  }

  await db.user.delete({ where: { id } });
  revalidatePath("/users");
  return { success: true };
}
