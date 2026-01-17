import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createLead(data: any) {
    return this.prisma.lead.create({ data });
  }

 findLeads(filters: any, user: { id: string; role: string; tenantId: string; branchId: string }) {
  const page = Number(filters.page) || 1;
  const limit = Math.min(Number(filters.limit) || 20, 50);
  const skip = (page - 1) * limit;

  /**
   * 🔐 MULTI-TENANT + IDOR PROTECTION
   * --------------------------------------------------
   * Every query must be scoped to tenant and branch.
   * This prevents cross-tenant data leakage.
   */
  const where: any = {
    deleted_at: null,
    tenantId: user.tenantId,
    branchId: user.branchId,
  };

  /**
   * 🔐 ROLE-BASED OWNERSHIP ENFORCEMENT
   * --------------------------------------------------
   * Counsellors can only see their own leads.
   * Admins can filter by owner_id.
   */
  if (user.role === "COUNSELLOR") {
    where.owner_id = user.id;
  } else if (filters.owner_id) {
    where.owner_id = filters.owner_id;
  }

  /**
   * 🔐 FILTER VALIDATION
   */
  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.source) {
    where.source = filters.source;
  }

  /**
   * 🔐 DATE RANGE VALIDATION (optional but recommended)
   */
  if (filters.fromDate && filters.toDate) {
    where.updatedAt = {
      gte: new Date(filters.fromDate),
      lte: new Date(filters.toDate),
    };
  }

  return this.prisma.lead.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },

    /**
     * 🔐 DATA MINIMIZATION
     * --------------------------------------------------
     * Never expose tenantId, branchId, or deleted_at
     */
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      status: true,
      source: true,
      updatedAt: true,
    },
  });
}


  findById(id: string) {
    return this.prisma.lead.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  addActivity(leadId: string, action: string, metadata?: any) {
    return this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action,
        metadata,
      },
    });
  }

  getTimeline(lead_id: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.leadActivity.findMany({
      where: { lead_id },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  bulkInsertLeads(data: any[]) {
    return this.prisma.lead.createMany({
      data,
      skipDuplicates: true,
    });
  }

  bulkInsertActivities(data: any[]) {
    return this.prisma.leadActivity.createMany({
      data,
    });
  }

  updateLeadOwner(leadId: string, ownerId: string) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { owner_id: ownerId },
    });
  }

  updateLeadFields(leadId: string, data: any) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data,
    });
  }

  async sdelete(leadId: string) {
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { deleted_at: new Date() },
    });

    return {
      success: true,
      message: "Lead deleted successfully",
      leadId,
      deleted_at: new Date(),
    };
  }
}