import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateApplicationDto } from "../../dto/application.dto";
import { ApplicationStatus } from "../../constants/application-status.constant";
import { CryptoUtil } from "src/common/crypto/crypto.util";

/**
 * Remove unsafe fields
 */
function sanitizeFormData(data: any) {
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.otp;
  delete sanitized.token;
  return sanitized;
}

/**
 * Encrypt PII
 */
async function encryptFormPII(formData: any) {
  const copy = { ...formData };

  if (copy.name) copy.name = await CryptoUtil.encrypt(copy.name);
  if (copy.email) copy.email = await CryptoUtil.encrypt(copy.email);
  if (copy.phone) copy.phone = await CryptoUtil.encrypt(copy.phone);

  return copy;
}

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * CREATE + SUBMIT application (no Draft)
   */
  async createApplication(dto: CreateApplicationDto, user: any) {
    const { leadId, programId, formData } = dto;
    const { tenantId, branchId, id: userId } = user;

    // 1️⃣ Validate required fields
    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      throw new BadRequestException("Name, email and phone are required");
    }

    // 2️⃣ Validate formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException("Invalid email format");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException("Invalid phone number");
    }

    // 3️⃣ Validate lead ownership
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, branchId, deleted_at: null },
    });

    if (!lead) {
      throw new BadRequestException("Lead not found or access denied");
    }

    // 4️⃣ Prevent duplicate application
    const existing = await this.prisma.application.findFirst({
      where: { leadId, programId, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException(
        "Application already exists for this lead and program"
      );
    }

    // 5️⃣ Sanitize + encrypt
    const sanitized = {
      ...sanitizeFormData(formData),
      _meta: { version: "v1", storedAt: new Date() },
    };

    const encrypted = await encryptFormPII(sanitized);

    // 6️⃣ Create application as APPLIED (already submitted)
    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        formData: encrypted,
        applicationRef: "Undefined",
        tenantId,
        branchId,
        status: ApplicationStatus.UNDER_REVIEW,
        submittedAt: new Date(),
      },
    });

    // 7️⃣ Lead timeline
    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: "APPLICATION_SUBMITTED",
        metadata: {
          applicationId: application.id,
          programId,
        },
      },
    });

    // 8️⃣ Application timeline
    await this.prisma.activityTimeline.create({
      data: {
        entityType: "APPLICATION",
        entityId: application.id,
        eventType: "CREATED",
        title: "Application Submitted",
        description: "Lead submitted an application",
        actorId: userId,
      },
    });

    // 9️⃣ Audit log
    await this.prisma.audit_Logs.create({
      data: {
        action: "APPLICATION_SUBMITTED",
        entityType: "APPLICATION",
        entityId: application.id,
        actorId: userId,
        metadata: {
          leadId,
          programId,
          status: application.status,
        },
      },
    });

    // 10️⃣ Update lead
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: "APPLICATION_IN_PROGRESS" },
    });

    return {
      success: true,
      data: {
        applicationId: application.id,
        status: application.status,
      },
    };
  }
}
