"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validations";
import { studentRepository } from "@/repositories/student.repository";
import { auditRepository } from "@/repositories/audit.repository";
import { generateReceiptNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { StudentFilters } from "@/types";

async function getSessionOrThrow() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");
  return session;
}

async function getClientInfo() {
  const headersList = await headers();
  return {
    ipAddress: headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? null,
    userAgent: headersList.get("user-agent") ?? null,
  };
}

export async function getStudents(filters: StudentFilters = {}) {
  const session = await getSessionOrThrow();
  void session;
  return studentRepository.findAll(filters);
}

export async function getStudent(id: string) {
  const session = await getSessionOrThrow();
  void session;
  return studentRepository.findById(id);
}

export async function createStudent(data: unknown) {
  const session = await getSessionOrThrow();
  const { ipAddress, userAgent } = await getClientInfo();

  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { birthDate, email, address, ...rest } = parsed.data;

  // Check CIN uniqueness
  const existing = await studentRepository.findByCin(rest.cin);
  if (existing) {
    return { success: false, error: "Un élève avec ce CIN existe déjà" };
  }

  const totalPrice = rest.totalPrice;
  const student = await studentRepository.create({
    ...rest,
    email: email || null,
    address: address || null,
    birthDate: birthDate ?? null,
    totalPrice,
    remainingAmount: totalPrice,
    paidAmount: 0,
    paymentPercentage: 0,
  });

  await auditRepository.create({
    userId: session.user.id,
    action: "CREATE",
    entity: "Student",
    entityId: student.id,
    newValues: { firstName: student.firstName, lastName: student.lastName, cin: student.cin },
    ipAddress,
    userAgent,
  });

  revalidatePath("/students");
  revalidatePath("/");

  return { success: true, data: student };
}

export async function updateStudent(id: string, data: unknown) {
  const session = await getSessionOrThrow();
  const { ipAddress, userAgent } = await getClientInfo();

  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await studentRepository.findById(id);
  if (!existing) return { success: false, error: "Élève introuvable" };

  // Check CIN uniqueness (exclude current student)
  if (parsed.data.cin !== existing.cin) {
    const cinExists = await studentRepository.findByCin(parsed.data.cin);
    if (cinExists) return { success: false, error: "Un élève avec ce CIN existe déjà" };
  }

  const { birthDate, email, address, ...rest } = parsed.data;
  const updated = await studentRepository.update(id, {
    ...rest,
    email: email || null,
    address: address || null,
    birthDate: birthDate ?? null,
  });

  await auditRepository.create({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Student",
    entityId: id,
    oldValues: { firstName: existing.firstName, lastName: existing.lastName },
    newValues: { firstName: updated.firstName, lastName: updated.lastName },
    ipAddress,
    userAgent,
  });

  revalidatePath(`/students/${id}`);
  revalidatePath("/students");

  return { success: true, data: updated };
}

export async function deleteStudent(id: string) {
  const session = await getSessionOrThrow();
  const { ipAddress, userAgent } = await getClientInfo();

  const existing = await studentRepository.findById(id);
  if (!existing) return { success: false, error: "Élève introuvable" };

  await studentRepository.softDelete(id);

  await auditRepository.create({
    userId: session.user.id,
    action: "DELETE",
    entity: "Student",
    entityId: id,
    oldValues: { firstName: existing.firstName, lastName: existing.lastName },
    ipAddress,
    userAgent,
  });

  revalidatePath("/students");
  revalidatePath("/");

  return { success: true };
}

export async function restoreStudent(id: string) {
  const session = await getSessionOrThrow();
  const { ipAddress, userAgent } = await getClientInfo();

  const student = await studentRepository.restore(id);

  await auditRepository.create({
    userId: session.user.id,
    action: "RESTORE",
    entity: "Student",
    entityId: id,
    newValues: { firstName: student.firstName, lastName: student.lastName },
    ipAddress,
    userAgent,
  });

  revalidatePath("/students");

  return { success: true, data: student };
}

export async function getDashboardStats() {
  const session = await getSessionOrThrow();
  void session;
  return studentRepository.getDashboardStats();
}

export async function getMonthlyStats(year: number) {
  const session = await getSessionOrThrow();
  void session;
  return studentRepository.getMonthlyStats(year);
}

export async function uploadStudentPhoto(studentId: string, formData: FormData) {
  const session = await getSessionOrThrow();
  void session;

  const file = formData.get("photo") as File;
  if (!file) return { success: false, error: "Aucun fichier fourni" };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Format de fichier non supporté (JPEG, PNG, WEBP uniquement)" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Le fichier ne doit pas dépasser 5MB" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${studentId}-${Date.now()}.${file.name.split(".").pop()}`;

  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");
  const uploadDir = join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const photoUrl = `/uploads/${filename}`;
  await studentRepository.update(studentId, { photoUrl });

  revalidatePath(`/students/${studentId}`);

  return { success: true, data: { photoUrl } };
}

export async function addStudentNote(studentId: string, content: string) {
  const session = await getSessionOrThrow();

  if (!content || content.trim().length === 0) {
    return { success: false, error: "La note ne peut pas être vide" };
  }

  const note = await prisma.note.create({
    data: {
      studentId,
      content: content.trim(),
      createdById: session.user.id,
    },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  revalidatePath(`/students/${studentId}`);

  return { success: true, data: note };
}

export async function deleteStudentNote(noteId: string, studentId: string) {
  await getSessionOrThrow();

  await prisma.note.delete({ where: { id: noteId } });

  revalidatePath(`/students/${studentId}`);

  return { success: true };
}

export async function generateNextReceiptNumber() {
  return generateReceiptNumber();
}
