import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { AuditAction } from "@/types";

interface CreateAuditLogParams {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export const auditRepository = {
  async create(params: CreateAuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action as never,
          entity: params.entity,
          entityId: params.entityId,
          oldValues: params.oldValues ? (params.oldValues as unknown as Prisma.InputJsonValue) : undefined,
          newValues: params.newValues ? (params.newValues as unknown as Prisma.InputJsonValue) : undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      // Don't throw on audit log failure - just warn
      console.warn("Failed to create audit log:", error);
      return null;
    }
  },

  async findAll(options: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: AuditAction;
    entity?: string;
  } = {}) {
    const { page = 1, limit = 20, userId, action, entity } = options;

    const where = {
      ...(userId && { userId }),
      ...(action && { action: action as never }),
      ...(entity && { entity }),
    };

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, email: true, role: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },
};
