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
  id: lead.id,
  name: await CryptoUtil.decrypt(lead.name),
  email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
  phone: await CryptoUtil.decrypt(lead.phone),
  status: lead.status,
  source: lead.source,
  createdAt: lead.createdAt,
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

async getLeads(
  filters: LeadFilterDto,
  user: { id: string; role: string; tenantId: string; branchId: string }
) {
  const page = Number(filters.page) || 1;
  const limit = Math.min(Number(filters.limit) || 10, 50);

  const leads = await this.repo.findLeads(
    {
      ...filters,
      page,
      limit,
    },
    user
  );


  /**
 * 🔐 RESPONSE FILTERING (Excessive Data Exposure Protection)
 * --------------------------------------------------
 * Only business-safe fields are returned.
 * Internal fields like tenantId, branchId, owner_id,
 * deleted_at, and encrypted values are never exposed.
 */
return Promise.all(
  leads.map(async (lead) => ({
    id: lead.id,                                      // Public identifier
    name: await CryptoUtil.decrypt(lead.name),        // PII (authorized)
    email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
    phone: await CryptoUtil.decrypt(lead.phone),
    status: lead.status,
    source: lead.source,
    createdAt: lead.updatedAt,                        // Audit-safe
  }))
);

}


 async getLead(
  id: string,
  user: { tenantId: string; branchId: string }
) {
  /**
   * 🔐 BOLA / IDOR PROTECTION
   * --------------------------------------------------
   * We do NOT trust the lead ID coming from the URL.
   * We enforce tenant & branch ownership before
   * returning any data.
   */
  const lead = await this.prisma.lead.findFirst({
    where: {
      id,
      tenantId: user.tenantId,
      branchId: user.branchId,
      deleted_at: null,
    },
  });

  if (!lead) {
    throw new ForbiddenException("Lead not found or access denied");
  }

  /**
   * Timeline is safe to fetch only AFTER ownership is verified
   */
  const timeline = await this.repo.getTimeline(id, 1, 10);

  /**
   * 🔐 RESPONSE FILTERING (Excessive Data Exposure Protection)
   * --------------------------------------------------
   * Only business-safe fields are returned.
   */
  return {
    lead: {
      id: lead.id,
      name: await CryptoUtil.decrypt(lead.name),
      email: lead.email
        ? await CryptoUtil.decrypt(lead.email)
        : null,
      phone: await CryptoUtil.decrypt(lead.phone),
      status: lead.status,
      source: lead.source,
      updatedAt: lead.updatedAt,   // use this if createdAt doesn't exist
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
  id: lead.id,
  name: await CryptoUtil.decrypt(lead.name),
  email: lead.email ? await CryptoUtil.decrypt(lead.email) : null,
  phone: await CryptoUtil.decrypt(lead.phone),
  status: lead.status,
  source: lead.source,
  createdAt: lead.createdAt,
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
  user: { id: string; role: string; tenantId?: string; branchId?: string }
) {

  /**
   * 🔐 BOLA / IDOR SECURITY LAYER
   * --------------------------------------------------
   * We DO NOT trust the leadId coming from the URL.
   * We must ensure the Lead belongs to the same tenant
   * and branch as the logged-in user.
   */
  const lead = await this.prisma.lead.findFirst({
    where: {
      id: leadId,
      tenantId: user.tenantId,
      branchId: user.branchId,
      deleted_at: null,
    },
  });

  if (!lead) {
    throw new ForbiddenException("Lead not found or access denied");
  }

  /**
   * Existing ownership & role validation
   */
  if (user.role === "COUNSELLOR") {
    if (!lead.owner_id) {
      throw new ForbiddenException("Lead is not assigned to you yet");
    }
    if (lead.owner_id !== user.id) {
      throw new ForbiddenException("You can update only your assigned leads");
    }
  }

  /**
 * 🔐 PARAMETER VALIDATION SECURITY
 * --------------------------------------------------
 * This prevents:
 * - Junk data injection
 * - Type confusion attacks
 * - Business logic bypass
 * - SQL/NoSQL injection chaining
 * - Unexpected field injection
 */
const allowedFields = ["name", "phone", "email", "status", "source"];

for (const key of Object.keys(dto)) {
  if (!allowedFields.includes(key)) {
    throw new BadRequestException(`Invalid parameter: ${key}`);
  }
}

if (dto.name !== undefined && typeof dto.name !== "string") {
  throw new BadRequestException("Invalid name");
}

if (dto.phone !== undefined && !/^[0-9]{10}$/.test(dto.phone)) {
  throw new BadRequestException("Invalid phone number");
}

if (dto.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
  throw new BadRequestException("Invalid email");
}

const allowedStatus = ["NEW", "CONTACTED", "IN_PROGRESS", "QUALIFIED", "REJECTED"];

if (dto.status !== undefined && !allowedStatus.includes(dto.status)) {
  throw new BadRequestException("Invalid status value");
}

if (dto.source !== undefined && typeof dto.source !== "string") {
  throw new BadRequestException("Invalid source");
}


  /**
   * Your existing data handling logic
   */
  const data: any = {};

  if (dto.name !== undefined) data.name = await CryptoUtil.encrypt(dto.name);
  if (dto.phone !== undefined) data.phone = await CryptoUtil.encrypt(dto.phone);
  if (dto.email !== undefined)
    data.email = await CryptoUtil.encrypt(dto.email);
  if (dto.status !== undefined) data.status = dto.status;
  if (dto.source !== undefined) data.source = dto.source;

  /**
   * 🔐 LOGIC-FLOW SECURITY (Fix for Empty JSON / Workflow Abuse)
   * --------------------------------------------------
   * If Burp sends `{}` or no valid fields,
   * we block the update.
   *
   * This prevents:
   * - Silent updates
   * - Audit log spam
   * - Workflow abuse
   * - Unauthorized state manipulation
   */
  if (Object.keys(data).length === 0) {
    throw new BadRequestException(
      "At least one valid field must be provided for update"
    );
  }

  /**
   * Update is now SAFE
   */
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
  id: updatedLead.id,
  name: await CryptoUtil.decrypt(updatedLead.name),
  email: updatedLead.email ? await CryptoUtil.decrypt(updatedLead.email) : null,
  phone: await CryptoUtil.decrypt(updatedLead.phone),
  status: updatedLead.status,
  source: updatedLead.source,
  createdAt: updatedLead.createdAt,
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










