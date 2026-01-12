import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { LeadsRepository } from "./leads.repository";
import { CreateLeadDto } from "../../dto/create-lead.dto";
import { LeadFilterDto } from "../../dto/lead-filter.dto";
import { LeadTimelineAction } from "../../constants/lead.constants";
import { PrismaService } from "src/database/prisma.service";
import { CryptoUtil } from "src/common/crypto/crypto.util";

@Injectable()
export class LeadsService {
  constructor(
    private readonly repo: LeadsRepository,
    private readonly prisma: PrismaService
  ) {}

  async createLead(dto: CreateLeadDto, userId: string) {
    const lead = await this.repo.createLead({
      ...dto,
      name: await CryptoUtil.encrypt(dto.name),
      email: dto.email ? await CryptoUtil.encrypt(dto.email) : null,
      phone: await CryptoUtil.encrypt(dto.phone),
      owner_id: userId,
    });

    await this.repo.bulkInsertActivities([
      {
        lead_id: lead.id,
        action: LeadTimelineAction.CREATE,
        metadata: { performedBy: userId },
      },
    ]);

    return {
      ...lead,
      name: await CryptoUtil.decrypt(lead.name),
      email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
      phone: await CryptoUtil.decrypt(lead.phone),
    };
  }

  async createWebsiteLead(dto: CreateLeadDto) {
    try{
    const lead = await this.repo.createLead({
      ...dto,
      name: await CryptoUtil.encrypt(dto.name),
      email: dto.email ? await CryptoUtil.encrypt(dto.email) : null,
      phone: await CryptoUtil.encrypt(dto.phone),
      owner_id: null,
      status: "NEW",
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

    return {
      ...lead,
      name: await CryptoUtil.decrypt(lead.name),
      email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
      phone: await CryptoUtil.decrypt(lead.phone),
    };
  }
  catch (error) {
    console.error("CREATE WEBSITE LEAD ERROR 👉", error); // ✅ THIS LINE
    throw error;
  }}

async getLeads(filters: LeadFilterDto) {
  const leads = await this.repo.findLeads(filters);

  return Promise.all(
    leads.map(async (lead) => ({
      ...lead,
      name: await CryptoUtil.decrypt(lead.name),
      email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
      phone: await CryptoUtil.decrypt(lead.phone),
    }))
  );
}


  async getLead(id: string) {
    const [lead, timeline] = await Promise.all([
      this.repo.findById(id),
      this.repo.getTimeline(id, 1, 10),
    ]);

    if (!lead) throw new BadRequestException("Lead not found");

    return {
      lead: {
        ...lead,
        name: await CryptoUtil.decrypt(lead.name),
        email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
        phone: await CryptoUtil.decrypt(lead.phone),
      },
      timeline,
    };
  }

  async createCounsellorLead(
    dto: CreateLeadDto,
    user: { id: string; tenantId: string; branchId: string; role: string }
  ) {
    const lead = await this.repo.createLead({
      ...dto,
      name: await CryptoUtil.encrypt(dto.name),
      email: dto.email ? await CryptoUtil.encrypt(dto.email) : null,
      phone: await CryptoUtil.encrypt(dto.phone),
      owner_id: user.id,
      status: "NEW",
      tenantId: user.tenantId,
      branchId: user.branchId,
    });

    await this.repo.addActivity(lead.id, LeadTimelineAction.CREATE, {
      source: user.role,
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

    return {
      ...lead,
      name: await CryptoUtil.decrypt(lead.name),
      email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
      phone: await CryptoUtil.decrypt(lead.phone),
    };
  }

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
    if (!lead) throw new BadRequestException("Lead not found");

    if (user.role === "COUNSELLOR") {
      if (!lead.owner_id) {
        throw new ForbiddenException("Lead is not assigned to you yet");
      }
      if (lead.owner_id !== user.id) {
        throw new ForbiddenException("You can update only your assigned leads");
      }
    }

    const data: any = {};

    if (dto.name !== undefined) data.name = await CryptoUtil.encrypt(dto.name);
    if (dto.phone !== undefined) data.phone = await CryptoUtil.encrypt(dto.phone);
    if (dto.email !== undefined)
      data.email = await CryptoUtil.encrypt(dto.email);
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.source !== undefined) data.source = dto.source;

    const updatedLead = await this.repo.updateLeadFields(leadId, data);

    await this.repo.addActivity(leadId, LeadTimelineAction.UPDATE, {
      updatedBy: user.id,
      role: user.role,
      changes: data,
    });

    await this.prisma.auditLog.create({
      data: {
        tableName: "Lead",
        action: "UPDATE",
        oldValue: lead,
        newValue: updatedLead,
        userId: user.id,
      },
    });

    return {
      ...updatedLead,
      name: await CryptoUtil.decrypt(updatedLead.name),
      email: updatedLead.email
        ? await CryptoUtil.decrypt(updatedLead.email)
        : null,
      phone: await CryptoUtil.decrypt(updatedLead.phone),
    };
  }

  async softDeleteUser(leadId: string, user: { id: string; role: string }) {
    const lead = await this.repo.findById(leadId);
    if (!lead) throw new BadRequestException("Lead not found");

    if (user.role === "COUNSELLOR") {
      if (!lead.owner_id) {
        throw new ForbiddenException("Lead is not assigned to you yet");
      }
      if (lead.owner_id !== user.id) {
        throw new ForbiddenException("You can update only your assigned leads");
      }
    }

    await this.prisma.auditLog.create({
      data: {
        tableName: "Lead",
        action: "DELETE",
        oldValue: lead,
        newValue: null,
        userId: user.id,
      },
    });

    return this.repo.sdelete(leadId);
  }
}










/*

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


  /*

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
  */