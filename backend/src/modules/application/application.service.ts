import { ActivityTimeline } from './../../../node_modules/.prisma/client/index.d';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { CryptoUtil } from 'src/common/crypto/crypto.util';
import { ALLOWED_TRANSITIONS } from './application-flow';
import { ApplicationStatus } from '@prisma/client';

function sanitizeFormData(data: any) {
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.otp;
  delete sanitized.token;
  return sanitized;
}
/**
 * 🔒 STATIC FEE STATUS (TEMPORARY)
 * Will be replaced by payment module later
 */
const STATIC_FEE_STATUS = {
  isFeeRequired: true,
  isFeePaid: true, // set false to test validation
};


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



  // ===========================
  // CREATE APPLICATION (DRAFT)
  // ===========================
  async createApplication(dto: CreateApplicationDto, user: any) {
    const { leadId, programId, formData } = dto;
    const { tenantId, branchId } = user;

    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, branchId, deleted_at: null },
    });

    if (!lead) throw new BadRequestException('Lead not found');

    const finalData = {
      name: formData?.name || lead.name,
      email: formData?.email || lead.email,
      phone: formData?.phone || lead.phone,
      ...formData,
    };

    if (!finalData.name || !finalData.email || !finalData.phone) {
      throw new BadRequestException('Name, email and phone are required');
    }

    const existing = await this.prisma.application.findFirst({
      where: { leadId, programId, tenantId, branchId, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException('Application already exists');
    }

    const sanitized = {
      ...sanitizeFormData(finalData),
      _meta: { version: 'v1', storedAt: new Date() },
    };

    const encrypted = await encryptFormPII(sanitized);

    const applicationRef = `APP-${Date.now()}`;

    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        tenantId,
        branchId,
        applicationRef,
        formData: encrypted,
        status: ApplicationStatus.DRAFT,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: 'APPLICATION_STARTED',
        metadata: { applicationId: application.id },
      },
    });

    return {
      success: true,
      data: {
        applicationId: application.id,
        status: application.status,
        applicationRef,
      },
    };
  }
// ===========================
// EPIC-1: UPDATE APPLICATION FORM DATA (DRAFT ONLY)
// ===========================
async updateApplicationForm(
  applicationId: string,
  formData: any,
  user: any,
) {
  const { tenantId, branchId } = user;

  // 1️⃣ Load application (tenant-safe)
  const application = await this.prisma.application.findFirst({
    where: {
      id: applicationId,
      tenantId,
      branchId,
      deletedAt: null,
    },
  });

  if (!application) {
    throw new BadRequestException('Application not found');
  }

  // 2️⃣ Allow update ONLY in DRAFT
  if (application.status !== ApplicationStatus.DRAFT) {
    throw new BadRequestException(
      'Application cannot be edited after submission',
    );
  }

  // 3️⃣ Sanitize incoming data
  const sanitized = sanitizeFormData(formData);

  // 4️⃣ Merge old + new formData
  const mergedFormData = {
...(application.formData as Record<string, any> || {}),
    ...sanitized,
    _meta: {
...((application.formData as any)?._meta || {}),
      lastUpdatedAt: new Date(),
    },
  };

  // 5️⃣ Encrypt PII fields if present
  const encrypted = await encryptFormPII(mergedFormData);

  // 6️⃣ Update application
  const updated = await this.prisma.application.update({
    where: { id: applicationId },
    data: {
      formData: encrypted,
    },
  });

  return {
    success: true,
    data: {
      applicationId: updated.id,
      status: updated.status,
    },
  };
  async function decryptFormPII(formData: any) {
  if (!formData || typeof formData !== 'object') return formData;

  const copy = { ...formData };

  if (copy.name) copy.name = await CryptoUtil.decrypt(copy.name);
  if (copy.email) copy.email = await CryptoUtil.decrypt(copy.email);
  if (copy.phone) copy.phone = await CryptoUtil.decrypt(copy.phone);

  return copy;
}

}

  // ===========================
  // SUBMIT APPLICATION
  // ===========================
  async submitApplication(applicationId: string, user: any) {
    const { tenantId, branchId, id: userId } = user;

    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, tenantId, branchId, deletedAt: null },
    });

    if (!application) throw new BadRequestException('Application not found');

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new BadRequestException('Only draft applications can be submitted');
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.APPLIED,
        submittedAt: new Date(),
      },
    });

    await this.prisma.activityTimeline.create({
      data: {
        entityType: 'APPLICATION',
        entityId: applicationId,
        eventType: 'STATUS_CHANGED',
        title: 'Application Submitted',
        actorId: userId,
      },
    });

    await this.prisma.audit_Logs.create({
      data: {
        action: 'APPLICATION_SUBMITTED',
        entityType: 'APPLICATION',
        entityId: applicationId,
        actorId: userId,
      },
    });

    return updated;
  }

  // ===========================
  // EPIC-3: STATUS PIPELINE
  // ===========================
 async updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  notes: string,
  user: any,
) {
  const { tenantId, branchId, id: userId, role } = user;


  /**
 * 💰 STATIC FEE STATUS CHECK (EPIC 3.1.3)
 */
if (
  newStatus === ApplicationStatus.APPROVED &&
  STATIC_FEE_STATUS.isFeeRequired &&
  !STATIC_FEE_STATUS.isFeePaid
) {
  throw new BadRequestException('Application fee not paid');
}

  /**
   * 🔐 0️⃣ Permission enforcement
   * Only ADMIN & COUNSELLOR can change status
   */
  const ALLOWED_ROLES = ['ADMIN', 'COUNSELLOR'];
  if (!ALLOWED_ROLES.includes(role)) {
    throw new BadRequestException(
      'You do not have permission to change application status',
    );
  }

  /**
   * 1️⃣ Load application with tenant & branch isolation
   */
  const application = await this.prisma.application.findFirst({
    where: {
      id: applicationId,
      tenantId,
      branchId,
      deletedAt: null,
    },
  });

  if (!application) {
    throw new BadRequestException('Application not found or access denied');
  }

  const oldStatus = application.status;

  /**
   * 2️⃣ Validate allowed transition (state machine)
   */
  const allowed = ALLOWED_TRANSITIONS[oldStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new BadRequestException(
      `Invalid transition from ${oldStatus} to ${newStatus}`,
    );
  }

  /**
   * 3️⃣ Update application status
   */
  const updated = await this.prisma.application.update({
    where: { id: applicationId },
    data: {
      status: newStatus,
      reviewedBy: userId,
    },
  });

  /**
   * 4️⃣ Application timeline entry
   */
  await this.prisma.activityTimeline.create({
    data: {
      entityType: 'APPLICATION',
      entityId: applicationId,
      eventType: 'STATUS_CHANGED',
      title: `Status changed to ${newStatus}`,
      description: notes,
      actorId: userId,
    },
  });

  /**
   * 5️⃣ Business audit log
   */
  await this.prisma.audit_Logs.create({
    data: {
      action: `STATUS_${newStatus}`,
      entityType: 'APPLICATION',
      entityId: applicationId,
      actorId: userId,
      metadata: {
        from: oldStatus,
        to: newStatus,
        notes,
        role,
      },
    },
  });

  return {
    success: true,
    data: {
      applicationId: updated.id,
      oldStatus,
      newStatus,
    },
  };
}

// ===========================
// EPIC 3.3 — GET APPLICATION TIMELINE
// ===========================
async getApplicationTimeline(applicationId: string, user: any) {
  const { tenantId, branchId } = user;

  return this.prisma.activityTimeline.findMany({
    where: {
      entityType: 'APPLICATION',
      entityId: applicationId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}


}
