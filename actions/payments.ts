"use server";

import { db } from "@/lib/db";

import { auth } from "@/lib/auth";
import { paymentSchema } from "@/lib/validations";
import { paymentRepository } from "@/repositories/payment.repository";
import { studentRepository } from "@/repositories/student.repository";
import { auditRepository } from "@/repositories/audit.repository";
import { generateReceiptNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { PaymentFilters } from "@/types";

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

export async function getPayments(filters: PaymentFilters = {}) {
  const session = await getSessionOrThrow();
  void session;
  return paymentRepository.findAll(filters);
}

export async function getPayment(id: string) {
  const session = await getSessionOrThrow();
  void session;
  return paymentRepository.findById(id);
}

export async function createPayment(data: unknown) {
  const session = await getSessionOrThrow();
  const { ipAddress, userAgent } = await getClientInfo();

  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const student = await studentRepository.findById(parsed.data.studentId);
  if (!student) return { success: false, error: "Élève introuvable" };

  const remainingAmount = Number(student.remainingAmount);
  if (parsed.data.amount > remainingAmount + 0.01) {
    return {
      success: false,
      error: `Le montant dépasse le solde restant (${remainingAmount.toFixed(2)} DH)`,
    };
  }

  const receiptNumber = generateReceiptNumber();

  const payment = await paymentRepository.create({
    student: { connect: { id: parsed.data.studentId } },
    amount: parsed.data.amount,
    paymentDate: parsed.data.paymentDate,
    paymentMethod: parsed.data.paymentMethod,
    description: parsed.data.description || null,
    receiptNumber,
    createdBy: { connect: { id: session.user.id } },
  });

  // Update student financials
  await studentRepository.updateFinancials(parsed.data.studentId);

  await auditRepository.create({
    userId: session.user.id,
    action: "CREATE",
    entity: "Payment",
    entityId: payment.id,
    newValues: {
      amount: parsed.data.amount,
      studentId: parsed.data.studentId,
      receiptNumber,
    },
    ipAddress,
    userAgent,
  });

  revalidatePath("/payments");
  revalidatePath(`/students/${parsed.data.studentId}`);
  revalidatePath("/");

  return { success: true, data: payment };
}

export async function deletePayment(id: string) {
  const session = await getSessionOrThrow();
  const { ipAddress, userAgent } = await getClientInfo();

  const payment = await paymentRepository.findById(id);
  if (!payment) return { success: false, error: "Paiement introuvable" };

  // Only ADMIN can delete payments
  if ((session.user as { role: string }).role !== "ADMIN") {
    return { success: false, error: "Seul un administrateur peut supprimer un paiement" };
  }

  await paymentRepository.delete(id);

  // Recalculate student financials
  await studentRepository.updateFinancials(payment.studentId);

  await auditRepository.create({
    userId: session.user.id,
    action: "DELETE",
    entity: "Payment",
    entityId: id,
    oldValues: {
      amount: Number(payment.amount),
      studentId: payment.studentId,
      receiptNumber: payment.receiptNumber,
    },
    ipAddress,
    userAgent,
  });

  revalidatePath("/payments");
  revalidatePath(`/students/${payment.studentId}`);
  revalidatePath("/");

  return { success: true };
}

export async function getRecentPayments(limit: number = 5) {
  const session = await getSessionOrThrow();
  void session;
  return paymentRepository.getRecentPayments(limit);
}

export async function getStudentsWithBalance(limit: number = 10) {
  const session = await getSessionOrThrow();
  void session;
  return paymentRepository.getStudentsWithBalance(limit);
}

export async function getPaymentMethodStats(year: number) {
  const session = await getSessionOrThrow();
  void session;
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  const payments = await db.payment.groupBy({
    by: ['paymentMethod'],
    _sum: {
      amount: true,
    },
    where: {
      paymentDate: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
  });

  return payments.map(p => ({
    name: p.paymentMethod,
    value: Number(p._sum.amount || 0),
  }));
}
