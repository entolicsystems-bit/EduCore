import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createLead(data: any) {
    return this.prisma.lead.create({ data });
  }

  findLeads(filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Math.min(Number(filters.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.source) where.source = filters.source;
    if (filters.owner_id) where.owner_id = filters.owner_id;

    if (filters.fromDate || filters.toDate) {
      where.updatedAt = {};
      if (filters.fromDate) where.updatedAt.gte = new Date(filters.fromDate);
      if (filters.toDate) where.updatedAt.lte = new Date(filters.toDate);
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        status: true,
        source: true,
        owner_id: true,
        updatedAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
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

  updateLead(leadId: string, ownerId: string) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { owner_id: ownerId },
    });
  }

  // deleteLead(leadId: string) {
  //   return this.prisma.lead.delete({
  //     where: { id: leadId },
  //   });
  // }

  sdelete(leadId: string) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { deleted_at: new Date() },
    });
  }
}
