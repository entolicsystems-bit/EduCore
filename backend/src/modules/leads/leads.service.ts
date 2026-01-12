import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { LeadsRepository } from "./leads.repository";
import { CreateLeadDto } from "../../dto/create-lead.dto";
import { LeadFilterDto } from "../../dto/lead-filter.dto";
import { parseCsv } from "../../utils/csv.util";
import { LeadTimelineAction } from "../../constants/lead.constants";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class LeadsService {
  constructor(
    private readonly repo: LeadsRepository,
    private readonly prisma: PrismaService
  ) {}

  async createLead(dto: CreateLeadDto, userId: string) {
    const lead = await this.repo.createLead({
      ...dto,
      owner_id: userId,
    });

    await this.repo.bulkInsertActivities([
      {
        lead_id: lead.id,
        action: LeadTimelineAction.CREATE,
        metadata: { performedBy: userId },
      },
    ]);

    return lead;
  }

  async createWebsiteLead(dto: CreateLeadDto) {
    const email = dto.email;
    const existingEmail = await this.prisma.lead.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException("Email already exists");
    }
    const phone = dto.phone;
    const existingPhone = await this.prisma.lead.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      throw new BadRequestException("PhoneNo already exists");
    }
    try {
      const lead = await this.repo.createLead({
        ...dto,
        owner_id: null, //new lead has no owner id
        status: "NEW",
        // tenantId: process.env.DEFAULT_TENANT_ID,
        // branchId: process.env.DEFAULT_BRANCH_ID,
      });

      await Promise.all([
        this.repo.addActivity(lead.id, "CREATE", { source: "WEBSITE" }),
        this.prisma.auditLog.create({
          data: {
            tableName: "Lead",
            action: "CREATE",
            oldValue: null,
            newValue: lead,
            userId: null,
          },
        }),
      ]);

      return lead;
    } catch (error) {
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0];
        throw new BadRequestException("Existing email or phone number");
      }
      throw error;
    }
  }

  getLeads(filters: LeadFilterDto) {
    return this.repo.findLeads(filters);
  }

  async getLead(id: string) {
    const [lead, timeline] = await Promise.all([
      this.repo.findById(id),
      this.repo.getTimeline(id, 1, 10),
    ]);

    if (!lead) throw new BadRequestException("Lead not found");

    return { lead, timeline };
  }

  async createCounsellorLead(
    dto: CreateLeadDto,
    user: { id: string; tenantId: string; branchId: string }
  ) {
    const lead = await this.repo.createLead({
      ...dto,
      owner_id: user.id,
      status: "NEW",
      tenantId: user.tenantId,
      branchId: user.branchId,
    });

    await this.repo.addActivity(lead.id, LeadTimelineAction.CREATE, {
      source: "COUNSELLOR",
      performedBy: user.id,
    });

    await this.prisma.auditLog.create({
      data: {
        tableName: "Lead",
        action: "CREATE",
        oldValue: null,
        newValue: lead,
        userId: user.id,
      },
    });

    return lead;
  }

  //  async createCounsellorLead(dto: CreateLeadDto, counsellorId: string) {
  //   const lead = await this.repo.createLead({
  //     ...dto,
  //     owner_id: counsellorId, // ✅ auto assign
  //     status: "NEW",
  //   });

  //   await this.repo.addActivity(lead.id, LeadTimelineAction.CREATE, {
  //     source: "COUNSELLOR",
  //     performedBy: counsellorId,
  //   });

  //   await this.prisma.auditLog.create({
  //     data: {
  //       tableName: "Lead",
  //       action: "CREATE",
  //       oldValue: null,
  //       newValue: lead,
  //       userId: counsellorId,
  //     },
  //   });

  //   return lead;
  // }

  async assignCounsellor(
    leadId: string,
    counsellorId: string,
    adminId: string
  ) {
    const lead = await this.repo.findById(leadId);
    if (!lead) throw new BadRequestException("Lead not found");

    await Promise.all([
      this.repo.updateLeadOwner(leadId, counsellorId),
      this.repo.bulkInsertActivities([
        {
          lead_id: leadId,
          action: LeadTimelineAction.ASSIGN,
          metadata: {
            performedBy: adminId,
            assignedTo: counsellorId,
          },
        },
      ]),
    ]);

    await this.prisma.auditLog.create({
      data: {
        tableName: "Lead",
        action: "ASSIGN",
        oldValue: lead,
        newValue: { ...lead, owner_id: counsellorId },
        userId: adminId,
      },
    });

    return { success: true };
  }

  getLeadTimeline(leadId: string, query: { page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 50);

    return this.repo.getTimeline(leadId, page, limit);
  }

  async updateLead(
    leadId: string,
    dto: any,
    user: { id: string; role: string }
  ) {
    const lead = await this.repo.findById(leadId);

    if (!lead) {
      throw new BadRequestException("Lead not found");
    }

    // 🔐 COUNSELLOR RULES
    if (user.role === "COUNSELLOR") {
      // ❌ not assigned yet
      if (!lead.owner_id) {
        throw new ForbiddenException("Lead is not assigned to you yet");
      }

      // ❌ assigned to someone else
      if (lead.owner_id !== user.id) {
        throw new ForbiddenException("You can update only your assigned leads");
      }
    }
    const email = dto.email;
    const existingEmail = await this.prisma.lead.findFirst({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException("Email already exists");
    }
    const phone = dto.phone;
    const existingPhone = await this.prisma.lead.findFirst({
      where: { phone },
    });
    if (existingPhone) {
      throw new BadRequestException("PhoneNo already exists");
    }

    // 🧼 sanitize update fields (NO owner_id allowed)
    const data: any = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.source !== undefined) data.source = dto.source;

    const updatedLead = await this.repo.updateLeadFields(leadId, data);

    // 🕒 timeline entry
    await this.repo.addActivity(leadId, LeadTimelineAction.UPDATE, {
      updatedBy: user.id,
      role: user.role,
      changes: data,
    });

    await this.prisma.auditLog.create({
      data: {
        tableName: "Lead",
        action: "UPDATE",
        oldValue: { status: lead }, // previous value
        newValue: { status: updatedLead }, // new value
        userId: user.id, // whoever made the change
      },
    });

    return updatedLead;
  }

  async softDeleteUser(leadId: string, user: { id: string; role: string }) {
    const lead = await this.repo.findById(leadId);

    if (!lead) {
      throw new BadRequestException("Lead not found");
    }

    if (user.role === "COUNSELLOR") {
      // ❌ not assigned yet
      if (!lead.owner_id) {
        throw new ForbiddenException("Lead is not assigned to you yet");
      }

      // ❌ assigned to someone else
      if (lead.owner_id !== user.id) {
        throw new ForbiddenException("You can update only your assigned leads");
      }
    }

    // const deleteLead = await this.repo.deleteLead(leadId);
    //return deleteLead;

    await this.prisma.auditLog.create({
      data: {
        tableName: "Lead",
        action: "DELETE",
        oldValue: { status: lead }, // previous value
        newValue: null,
        userId: user.id, // whoever made the change
      },
    });

    return this.repo.sdelete(leadId);
  }
}
