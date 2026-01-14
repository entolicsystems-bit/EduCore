import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { ApplicationStatus } from '../../constants/application-status.constant';
import { CryptoUtil } from 'src/common/crypto/crypto.util';

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

  async createApplication(dto: CreateApplicationDto, user: any) {
    const { leadId, programId, formData } = dto;
    const { tenantId, branchId, id: userId } = user;

    // 1️⃣ Load Lead
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, branchId, deleted_at: null },
    });

    if (!lead) {
      throw new BadRequestException('Lead not found or access denied');
    }

    // 2️⃣ Pre-populate from lead if missing
    const finalData = {
      name: formData.name || lead.name,
      email: formData.email || lead.email,
      phone: formData.phone || lead.phone,
      ...formData,
    };

    const { name, email, phone } = finalData;

    if (!name || !email || !phone) {
      throw new BadRequestException('Name, email and phone are required');
    }

    // 3️⃣ Validate formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    // 4️⃣ Prevent duplicate
    const existing = await this.prisma.application.findFirst({
      where: { leadId, programId, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException(
        'Application already exists for this lead and program',
      );
    }

    // 5️⃣ Sanitize + version
    const sanitized = {
      ...sanitizeFormData(finalData),
      _meta: {
        version: 'v1',
        storedAt: new Date(),
      },
    };

    const encrypted = await encryptFormPII(sanitized);

    // 6️⃣ Generate application reference
    const applicationRef = `APP-${new Date().getFullYear()}-${Date.now()}`;

    // 7️⃣ Create application (APPLIED = submitted)
    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        formData: encrypted,
        tenantId,
        branchId,
        applicationRef,
        status: ApplicationStatus.APPLIED,
        submittedAt: new Date(),
      },
    });

    // 8️⃣ Lead timeline → APPLICATION_STARTED
    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: 'APPLICATION_STARTED',
        metadata: { applicationId: application.id },
      },
    });

    // 9️⃣ Lead timeline → APPLICATION_SUBMITTED
    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: 'APPLICATION_SUBMITTED',
        metadata: { applicationId: application.id, programId },
      },
    });

    // 10️⃣ Application timeline
    await this.prisma.activityTimeline.create({
      data: {
        entityType: 'APPLICATION',
        entityId: application.id,
        eventType: 'CREATED',
        title: 'Application Submitted',
        description: 'Application created and submitted',
        actorId: userId,
      },
    });

    // 11️⃣ Business Audit (Sprint-2)
    await this.prisma.audit_Logs.create({
      data: {
        action: 'APPLICATION_SUBMITTED',
        entityType: 'APPLICATION',
        entityId: application.id,
        actorId: userId,
        metadata: {
          leadId,
          programId,
          applicationRef,
        },
      },
    });

    // 12️⃣ Update lead status
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: 'APPLICATION_IN_PROGRESS' },
    });

    return {
      success: true,
      data: {
        applicationId: application.id,
        applicationRef,
        status: application.status,
      },
    };
  }
}
