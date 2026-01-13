import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateApplicationDto } from "../../dto/application.dto";
import { ApplicationStatus } from "../../constants/application-status.constant";
import { CryptoUtil } from "src/common/crypto/crypto.util";

/**
 * Sanitizes sensitive data from formData
 */
function sanitizeFormData(data: any) {
  const sanitized = { ...data };

  delete sanitized.password;
  delete sanitized.otp;
  delete sanitized.token;

  return sanitized;
}

/**
 * 🔐 Encrypt PII inside formData
 */
async function encryptFormPII(formData: any) {
  const copy = { ...formData };

  if (copy.name) copy.name = await CryptoUtil.encrypt(copy.name); // 🔐
  if (copy.email) copy.email = await CryptoUtil.encrypt(copy.email); // 🔐
  if (copy.phone) copy.phone = await CryptoUtil.encrypt(copy.phone); // 🔐

  return copy;
}

/**
 * 🔓 Decrypt PII inside formData
 */
async function decryptFormPII(formData: any) {
  const copy = { ...formData };

  if (copy.name) copy.name = await CryptoUtil.decrypt(copy.name); // 🔓
  if (copy.email) copy.email = await CryptoUtil.decrypt(copy.email); // 🔓
  if (copy.phone) copy.phone = await CryptoUtil.decrypt(copy.phone); // 🔓

  return copy;
}

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(dto: CreateApplicationDto, user: any) {
    const { leadId, programId, formData } = dto;
    const { tenantId, branchId } = user;

    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      throw new BadRequestException("Name, email and phone are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException("Invalid email format");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException("Invalid phone number");
    }

    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, branchId, deleted_at: null },
    });

    if (!lead) {
      throw new BadRequestException("Lead not found or access denied");
    }

    const existingApplication = await this.prisma.application.findFirst({
      where: { leadId, programId, deletedAt: null },
    });

    if (existingApplication) {
      throw new BadRequestException(
        "Application already exists for this lead and program"
      );
    }

    const sanitizedFormData = {
      ...sanitizeFormData(formData),
      _meta: {
        version: "v1",
        storedAt: new Date(),
      },
    };

    const encryptedFormData = await encryptFormPII(sanitizedFormData); // 🔐 encrypt before DB

    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        formData: encryptedFormData, // 🔐 store encrypted
        tenantId,
        applicationRef: "Undefined",
        branchId,
        status: ApplicationStatus.UNDER_REVIEW,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: "APPLICATION_STARTED",
        metadata: {
          applicationId: application.id,
          programId,
        },
      },
    });

    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "APPLICATION_IN_PROGRESS",
      },
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
