import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { ApplicationStatus } from '../../constants/application-status.constant';

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

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(dto: CreateApplicationDto, user: any) {
    const { leadId, programId, formData } = dto;
    const { tenantId, branchId } = user;

    /**
     * 1️⃣ Validate required fields inside formData
     */
    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      throw new BadRequestException(
        'Name, email and phone are required',
      );
    }

    /**
     * 2️⃣ Validate email format
     */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    /**
     * 3️⃣ Validate phone number format
     */
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    /**
     * 4️⃣ Validate lead existence & tenant/branch ownership
     */
    const lead = await this.prisma.lead.findFirst({
      where: {
        id: leadId,
        tenantId,
        branchId,
        deleted_at: null,
      },
    });

    if (!lead) {
      throw new BadRequestException(
        'Lead not found or access denied',
      );
    }

    /**
     * 5️⃣ Prevent duplicate application (lead + program)
     */
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        leadId,
        programId,
        deletedAt: null,
      },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'Application already exists for this lead and program',
      );
    }

    /**
     * 6️⃣ Sanitize & version formData
     */
    const sanitizedFormData = {
      ...sanitizeFormData(formData),
      _meta: {
        version: 'v1',
        storedAt: new Date(),
      },
    };

    /**
     * 7️⃣ Create application (DRAFT)
     */
    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        formData: sanitizedFormData,
        tenantId,
        branchId,
        status: ApplicationStatus.DRAFT,
      },
    });

    /**
     * 8️⃣ Lead timeline entry — APPLICATION_STARTED
     */
    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: 'APPLICATION_STARTED',
        metadata: {
          applicationId: application.id,
          programId,
        },
      },
    });

    /**
     * 9️⃣ Update lead status
     */
    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'APPLICATION_IN_PROGRESS',
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
