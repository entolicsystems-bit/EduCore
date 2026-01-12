import { ApplicationTimelineAction } from './../../constants/application-status.constant';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { ApplicationStatus } from '../../constants/application-status.constant';
import { CryptoUtil } from 'src/common/crypto/crypto.util'; // 🔐 NEW

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

  if (copy.name) copy.name = await CryptoUtil.encrypt(copy.name);       // 🔐
  if (copy.email) copy.email = await CryptoUtil.encrypt(copy.email);   // 🔐
  if (copy.phone) copy.phone = await CryptoUtil.encrypt(copy.phone);   // 🔐

  return copy;
}

/**
 * 🔓 Decrypt PII inside formData
 */
async function decryptFormPII(formData: any) {
  const copy = { ...formData };

  if (copy.name) copy.name = await CryptoUtil.decrypt(copy.name);       // 🔓
  if (copy.email) copy.email = await CryptoUtil.decrypt(copy.email);   // 🔓
  if (copy.phone) copy.phone = await CryptoUtil.decrypt(copy.phone);   // 🔓

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
      throw new BadRequestException('Name, email and phone are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, branchId, deleted_at: null },
    });

    if (!lead) {
      throw new BadRequestException('Lead not found or access denied');
    }

    const existingApplication = await this.prisma.application.findFirst({
      where: { leadId, programId, deletedAt: null },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'Application already exists for this lead and program',
      );
    }

    const sanitizedFormData = {
      ...sanitizeFormData(formData),
      _meta: {
        version: 'v1',
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
        branchId,
        status: ApplicationStatus.DRAFT,
      },
    });

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

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: 'APPLICATION_IN_PROGRESS' },
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
  // ============================
  // SUBMIT APPLICATION
  // ============================
//   async submitApplication(applicationId: string, user: any) {
//   const { tenantId, branchId, id: userId } = user;

//   const application = await this.prisma.application.findFirst({
//     where: { id: applicationId, tenantId, branchId, deletedAt: null },
//   });

//   if (!application) {
//     throw new BadRequestException('Application not found or access denied');
//   }

//   if (application.status !== ApplicationStatus.DRAFT) {
//     throw new BadRequestException(
//       `Application cannot be submitted in status ${application.status}`,
//     );
//   }

//   if (!application.formData || Object.keys(application.formData).length === 0) {
//     throw new BadRequestException('Application form is empty');
//   }

//   const updated = await this.prisma.application.update({
//     where: { id: applicationId },
//     data: {
//       status: ApplicationStatus.SUBMITTED,
//       submittedAt: new Date(),
//     },
//   });

//   await this.prisma.auditLog.create({
//   data: {
//     action: 'APPLICATION_SUBMITTED',
//     entityType: 'APPLICATION',
//     entityId: applicationId,
//     actorId: userId,
//     metadata: {
//       from: 'DRAFT',
//       to: 'SUBMITTED',
//     },
//   },
// });


// await this.prisma.systemEvent.create({
//   data: {
//     eventType: 'APPLICATION_SUBMITTED',
//     tenantId,
//     branchId,
//     refId: applicationId,
//     createdBy: userId,
//   },
// });


//   return {
//     success: true,
//     data: {
//       applicationId: updated.id,
//       status: updated.status,
//       submittedAt: updated.submittedAt,
//     },
//   };
// }
// }