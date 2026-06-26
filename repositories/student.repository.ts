import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { StudentFilters } from "@/types";

export const studentRepository = {
  async findAll(filters: StudentFilters = {}) {
    const {
      search,
      status,
      licenseCategory,
      dateFrom,
      dateTo,
      hasBalance,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const where: Prisma.StudentWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { cin: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(licenseCategory && { licenseCategory }),
      ...(dateFrom || dateTo
        ? {
            registrationDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {}),
      ...(hasBalance !== undefined && {
        remainingAmount: hasBalance ? { gt: 0 } : { equals: 0 },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.student.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { payments: true, notes: true } },
        },
      }),
      prisma.student.count({ where }),
    ]);

    const serializedData = data.map(s => ({
      ...s,
      totalPrice: Number(s.totalPrice),
      paidAmount: Number(s.paidAmount),
      remainingAmount: Number(s.remainingAmount),
    }));

    return { data: serializedData, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id, isDeleted: false },
      include: {
        payments: {
          orderBy: { paymentDate: "desc" },
          include: { createdBy: { select: { name: true, email: true } } },
        },
        notes: {
          orderBy: { createdAt: "desc" },
          include: { createdBy: { select: { name: true, email: true } } },
        },
        _count: { select: { payments: true, notes: true } },
      },
    });
    
    if (!student) return null;
    
    return {
      ...student,
      totalPrice: Number(student.totalPrice),
      paidAmount: Number(student.paidAmount),
      remainingAmount: Number(student.remainingAmount),
      payments: student.payments.map(p => ({ ...p, amount: Number(p.amount) }))
    };
  },

  async findByCin(cin: string) {
    return prisma.student.findUnique({ where: { cin, isDeleted: false } });
  },

  async create(data: Prisma.StudentCreateInput) {
    const student = await prisma.student.create({ data });
    return {
      ...student,
      totalPrice: Number(student.totalPrice),
      paidAmount: Number(student.paidAmount),
      remainingAmount: Number(student.remainingAmount),
    };
  },

  async update(id: string, data: Prisma.StudentUpdateInput) {
    const student = await prisma.student.update({ where: { id }, data });
    return {
      ...student,
      totalPrice: Number(student.totalPrice),
      paidAmount: Number(student.paidAmount),
      remainingAmount: Number(student.remainingAmount),
    };
  },

  async softDelete(id: string) {
    return prisma.student.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  },

  async restore(id: string) {
    return prisma.student.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });
  },

  async findDeleted() {
    return prisma.student.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: "desc" },
    });
  },

  async updateFinancials(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!student) return null;

    const paidAmount = student.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const totalPrice = Number(student.totalPrice);
    const remainingAmount = Math.max(0, totalPrice - paidAmount);
    const paymentPercentage = totalPrice > 0 ? Math.min(100, (paidAmount / totalPrice) * 100) : 0;
    const status =
      paymentPercentage >= 100
        ? "COMPLETED"
        : student.status === "SUSPENDED"
          ? "SUSPENDED"
          : "ACTIVE";

    return prisma.student.update({
      where: { id },
      data: { paidAmount, remainingAmount, paymentPercentage, status },
    });
  },

  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      activeStudents,
      completedStudents,
      suspendedStudents,
      financialAgg,
      monthlyRevenue,
      monthlyRegistrations,
    ] = await Promise.all([
      prisma.student.count({ where: { isDeleted: false } }),
      prisma.student.count({ where: { isDeleted: false, status: "ACTIVE" } }),
      prisma.student.count({ where: { isDeleted: false, status: "COMPLETED" } }),
      prisma.student.count({ where: { isDeleted: false, status: "SUSPENDED" } }),
      prisma.student.aggregate({
        where: { isDeleted: false },
        _sum: { paidAmount: true, remainingAmount: true },
      }),
      prisma.payment.aggregate({
        where: { paymentDate: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.student.count({
        where: { isDeleted: false, registrationDate: { gte: startOfMonth } },
      }),
    ]);

    const totalRevenue = Number(financialAgg._sum.paidAmount ?? 0);
    const totalRemaining = Number(financialAgg._sum.remainingAmount ?? 0);
    const collectionRate =
      totalRevenue + totalRemaining > 0
        ? (totalRevenue / (totalRevenue + totalRemaining)) * 100
        : 0;

    return {
      totalStudents,
      activeStudents,
      completedStudents,
      suspendedStudents,
      totalRevenue,
      totalRemaining,
      monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0),
      monthlyRegistrations,
      collectionRate,
    };
  },

  async getMonthlyStats(year: number) {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const stats = await Promise.all(
      months.map(async (month) => {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59);
        const [revenue, registrations, payments] = await Promise.all([
          prisma.payment.aggregate({
            where: { paymentDate: { gte: start, lte: end } },
            _sum: { amount: true },
          }),
          prisma.student.count({
            where: { isDeleted: false, registrationDate: { gte: start, lte: end } },
          }),
          prisma.payment.count({ where: { paymentDate: { gte: start, lte: end } } }),
        ]);
        return {
          month,
          revenue: Number(revenue._sum.amount ?? 0),
          registrations,
          payments,
        };
      })
    );
    return stats;
  },
};
