import { NotificationService } from "./../notifications/notification.service";
import { NotificationEvents } from "./../../constants/notification-event.constant";

import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateApplicationDto } from "../../dto/application.dto";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import { ALLOWED_TRANSITIONS } from "./application-flow";
import { ApplicationStatus } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function sanitizeFormData(data: any) {
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.otp;
  delete sanitized.token;
  return sanitized;
}
type ApplicationFormData = {
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
};

/**
 * 🔒 STATIC FEE STATUS (TEMPORARY)
 * Will be replaced by payment module later
 */
const STATIC_FEE_STATUS = {
  isFeeRequired: true,
  isFeePaid: true,
};

async function encryptFormPII(formData: any) {
  const copy = { ...formData };

  if (copy.name && !CryptoUtil.isEncrypted(copy.name)) {
    copy.name = await CryptoUtil.encrypt(copy.name);
  }

  if (copy.email && !CryptoUtil.isEncrypted(copy.email)) {
    copy.email = await CryptoUtil.encrypt(copy.email);
  }

  if (copy.phone && !CryptoUtil.isEncrypted(copy.phone)) {
    copy.phone = await CryptoUtil.encrypt(copy.phone);
  }

  return copy;
}

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService, // ✅ fixed DI
  ) {}
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // ===========================
  // 🔓 SAFE EMAIL EXTRACTOR
  // ===========================
  private async extractEmail(formData: any): Promise<string | null> {
    if (!formData || typeof formData !== "object" || !formData.email) {
      return null;
    }

    try {
      return await CryptoUtil.decrypt(formData.email);
    } catch {
      return null;
    }
  }

  // ===========================
  // CREATE APPLICATION (DRAFT)
  // ===========================
  async createApplication(
    dto: CreateApplicationDto,
    user: any,
    file?: Express.Multer.File,
  ) {
    try{
    const { leadId, programId, formData } = dto;
    const { tenantId, branchId } = user;

    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, branchId, deleted_at: null },
    });

    if (!lead) throw new BadRequestException("Lead not found");

    let imageUrl: string | undefined;

    if (file) {
      // Validate
      if (!file.mimetype.startsWith("image/")) {
        throw new BadRequestException("Only image files allowed");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException("Image must be less than 5MB");
      }

      const extension = file.originalname.split(".").pop();
      const key = `applications/${randomUUID()}.${extension}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: "AES256",
        }),
      );

      imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
    const finalData = {
      name: formData?.name || lead.name,
      email: formData?.email || lead.email,
      phone: formData?.phone || lead.phone,
      ...formData,
    };

    if (!finalData.name || !finalData.email || !finalData.phone) {
      throw new BadRequestException("Name, email and phone are required");
    }

    const existing = await this.prisma.application.findFirst({
      where: { leadId, programId, tenantId, branchId, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException("Application already exists");
    }

    const sanitized = {
      ...sanitizeFormData(finalData),
      _meta: { version: "v1", storedAt: new Date() },
    };

    const encrypted = await encryptFormPII(sanitized);

    const application = await this.prisma.application.create({
      data: {
        leadId,
        programId,
        tenantId,
        branchId,
        applicationRef: `APP-${Date.now()}`,
        formData: encrypted,
        status: ApplicationStatus.DRAFT,
        leadImageUrl: imageUrl,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        lead_id: leadId,
        action: "APPLICATION_STARTED",
        metadata: { applicationId: application.id },
      },
    });

    return {
      success: true,
      data: {
        applicationId: application.id,
        status: application.status,
        applicationRef: application.applicationRef,
      },
    };
  }catch(error){
    console.log(error);
    throw error;
  }
  }

  // ===========================
  // UPDATE APPLICATION (DRAFT)
  // ===========================
  async updateApplicationForm(applicationId: string, formData: any, user: any) {
    const { tenantId, branchId } = user;

    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, tenantId, branchId, deletedAt: null },
    });

    if (!application) throw new BadRequestException("Application not found");

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new BadRequestException(
        "Application cannot be edited after submission",
      );
    }

    const sanitized = sanitizeFormData(formData);

    const mergedFormData = {
      ...(application.formData as Record<string, any>),
      ...sanitized,
      _meta: {
        ...((application.formData as any)?._meta || {}),
        lastUpdatedAt: new Date(),
      },
    };

    const encrypted = await encryptFormPII(mergedFormData);

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { formData: encrypted },
    });

    return {
      success: true,
      data: {
        applicationId: updated.id,
        status: updated.status,
      },
    };
  }

  // ===========================
  // SUBMIT APPLICATION
  // ===========================
  async submitApplication(applicationId: string, user: any) {
    const { tenantId, branchId, id: userId } = user;

    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, tenantId, branchId, deletedAt: null },
    });

    if (!application) throw new BadRequestException("Application not found");
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new BadRequestException("Only draft applications can be submitted");
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
        entityType: "APPLICATION",
        entityId: applicationId,
        eventType: "STATUS_CHANGED",
        title: "Application Submitted",
        actorId: userId,
      },
    });

    // 🔔 EMAIL (non-blocking, template-safe)

    const email = await this.extractEmail(updated.formData);

    // Cast formData to typed object
    const formData = updated.formData as ApplicationFormData;
    // 🔓 Decrypt the name
    let decryptedName: string | undefined;
    try {
      decryptedName = formData.name
        ? await CryptoUtil.decrypt(formData.name)
        : undefined;
    } catch (err) {
      console.warn(`Failed to decrypt applicant name for ${updated.id}`, err);
      decryptedName = undefined;
    }

    const displayName = decryptedName || "Applicant";

    if (!email) {
      console.warn(
        `Email skipped for application ${updated.id}: email missing or invalid`,
      );
    } else {
      await this.notificationService
        .notify(NotificationEvents.APPLICATION_SUBMITTED, {
          to: email,
          name: displayName || "Applicant", // <-- safe access
          applicationId: updated.id, // <-- safe access
          applicationRef: updated.applicationRef, // already exists
        })
        .catch((err) => console.error("EMAIL ERROR:", err));
    }

    return updated;
  }

  // ===========================
  // STATUS PIPELINE
  // ===========================
  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    notes: string,
    user: any,
  ) {
    const { tenantId, branchId, id: userId, role } = user;

    if (
      newStatus === ApplicationStatus.APPROVED &&
      STATIC_FEE_STATUS.isFeeRequired &&
      !STATIC_FEE_STATUS.isFeePaid
    ) {
      throw new BadRequestException("Application fee not paid");
    }

    if (!["ADMIN", "COUNSELLOR"].includes(role)) {
      throw new BadRequestException("Permission denied");
    }

    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, tenantId, branchId, deletedAt: null },
    });

    if (!application) throw new BadRequestException("Application not found");

    const oldStatus = application.status;

    const allowed = ALLOWED_TRANSITIONS[oldStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid transition from ${oldStatus} to ${newStatus}`,
      );
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus, reviewedBy: userId },
    });

    await this.prisma.activityTimeline.create({
      data: {
        entityType: "APPLICATION",
        entityId: applicationId,
        eventType: "STATUS_CHANGED",
        title: `Status changed to ${newStatus}`,
        description: notes,
        actorId: userId,
      },
    });

    //Email Notification (non-blocking)
    // 🔔 EMAIL (updated block here)
    const email = await this.extractEmail(updated.formData);
    const formData = updated.formData as ApplicationFormData;

    if (!email) {
      console.warn(
        `Email skipped for application ${updated.id}: email missing or invalid`,
      );
    } else {
      await this.notificationService
        .notify(NotificationEvents.APPLICATION_SUBMITTED, {
          to: email,
          name: formData.name || "Applicant",
          applicationId: updated.id,
          applicationRef: updated.applicationRef,
        })
        .catch((err) => console.error("EMAIL ERROR:", err));
    }

    return updated;
  }
  // ===========================
  // APPLICATION TIMELINE
  // ===========================
  async getApplicationTimeline(applicationId: string, user: any) {
    return this.prisma.activityTimeline.findMany({
      where: {
        entityType: "APPLICATION",
        entityId: applicationId,
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
