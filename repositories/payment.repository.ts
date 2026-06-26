import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { PaymentFilters } from "@/types";

export const paymentRepository = {
  async findAll(filters: PaymentFilters = {}) {
    const { search, studentId, paymentMethod, dateFrom, dateTo, page = 1, limit = 10 } = filters;

    const where: Prisma.PaymentWhereInput = {
      ...(studentId && { studentId }),
      ...(paymentMethod && { paymentMethod }),
      ...(dateFrom || dateTo
        ? {
            paymentDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { receiptNumber: { contains: search, mode: "insensitive" } },
          { student: { firstName: { contains: search, mode: "insensitive" } } },
          { student: { lastName: { contains: search, mode: "insensitive" } } },
          { student: { cin: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { paymentDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          student: { select: { id: true, firstName: true, lastName: true, cin: true, photoUrl: true } },
          createdBy: { select: { name: true, email: true } },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    const serializedData = data.map(p => ({
      ...p,
      amount: Number(p.amount),
    }));

    return { data: serializedData, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        student: true,
        createdBy: { select: { name: true, email: true } },
      },
    });
    if (!payment) return null;
    return { ...payment, amount: Number(payment.amount) };
  },

  async findByStudentId(studentId: string) {
    const payments = await prisma.payment.findMany({
      where: { studentId },
      orderBy: { paymentDate: "desc" },
      include: { createdBy: { select: { name: true, email: true } } },
    });
    return payments.map(p => ({ ...p, amount: Number(p.amount) }));
  },

  async create(data: Prisma.PaymentCreateInput) {
    const payment = await prisma.payment.create({
      data,
      include: {
        student: true,
        createdBy: { select: { name: true, email: true } },
      },
    });
    return { ...payment, amount: Number(payment.amount) };
  },

  async delete(id: string) {
    return prisma.payment.delete({ where: { id } });
  },

  async getRecentPayments(limit: number = 5) {
    const payments = await prisma.payment.findMany({
      orderBy: { paymentDate: "desc" },
      take: limit,
      include: {
        student: { select: { id: true, firstName: true, lastName: true, photoUrl: true } },
      },
    });
    return payments.map(p => ({
      ...p,
      amount: Number(p.amount)
    }));
  },

  async getStudentsWithBalance(limit: number = 10) {
    const students = await prisma.student.findMany({
      where: { isDeleted: false, remainingAmount: { gt: 0 } },
      orderBy: { remainingAmount: "desc" },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cin: true,
        photoUrl: true,
        totalPrice: true,
        paidAmount: true,
        remainingAmount: true,
        paymentPercentage: true,
        status: true,
      },
    });
    return students.map(s => ({
      ...s,
      totalPrice: Number(s.totalPrice),
      paidAmount: Number(s.paidAmount),
      remainingAmount: Number(s.remainingAmount)
    }));
  },
};
