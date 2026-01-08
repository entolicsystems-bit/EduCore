import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { ApplicationStatus } from '../../constants/application-status.constant';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(dto: CreateApplicationDto, user: any) {
  const { leadId, programId, formData } = dto;
  const { tenantId, branchId, userId } = user;

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

    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        formData,
        tenantId,
        branchId,
        status: ApplicationStatus.DRAFT,
      },
    });

    // 🔥 Lead timeline entry
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

    // 🔥 Update lead status
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