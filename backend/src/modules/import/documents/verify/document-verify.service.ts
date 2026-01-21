import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ApplicationStatus,
  DocumentStatus,
  Prisma,
  User,
} from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { VerifyDocumentDto } from "src/dto/verify-document.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class VerifyDocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async verifyOneDocument(
    documentId: string,
    dto: VerifyDocumentDto,
    admin: User,
  ) {
    let shouldEmit = false;
    let applicationIdToEmit: string | null = null;

    const document = await this.prisma.admissionDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new BadRequestException("Document not found");
    }

    if (document.status !== DocumentStatus.UPLOADED) {
      throw new BadRequestException("Document already processed");
    }

    await this.prisma.$transaction(async (tx) => {
      const updatedDoc = await tx.admissionDocument.update({
        where: { id: documentId },
        data: {
          status: dto.status,
          verifiedBy: admin.id,
          verifiedAt: new Date(),
        },
      });

      await tx.audit_Logs.create({
        data: {
          action: "VERIFY_DOCUMENT",
          entityType: "ADMISSION_DOCUMENT",
          entityId: documentId,
          actorId: admin.id,
          metadata: {
            status: dto.status,
            comments: dto.comments,
          },
        },
      });

      if (dto.status === DocumentStatus.VERIFIED) {
        const allVerified = await this.handleAllDocumentsVerified(
          updatedDoc.applicationId,
          tx,
          admin.id,
        );

        if (allVerified) {
          shouldEmit = true;
          applicationIdToEmit = updatedDoc.applicationId;
        }
      }
    });

    // EVENT AFTER TRANSACTION COMMIT
    if (shouldEmit && applicationIdToEmit) {
      this.eventEmitter.emit("application.document_verified", {
        applicationId: applicationIdToEmit,
        adminId: admin.id,
      });
    }

    return {
      success: true,
    };
  }

  async bulkVerifyDocuments(
    documentIds: string[],
    dto: VerifyDocumentDto,
    admin: User,
  ) {
    let applicationsToEmit = new Set<string>();

    await this.prisma.$transaction(async (tx) => {
      const documents = await tx.admissionDocument.findMany({
        where: { id: { in: documentIds } },
      });

      for (const doc of documents) {
        if (doc.status !== DocumentStatus.UPLOADED) {
          throw new BadRequestException(`Document ${doc.id} already processed`);
        }
      //   await tx.audit_Logs.create({
      //   data: {
      //     action: "Bulk_VERIFY_DOCUMENT",
      //     entityType: "ADMISSION_DOCUMENT",
      //     entityId: doc.id,
      //     actorId: admin.id,
      //     metadata: {
      //       status: dto.status,
      //       comments: dto.comments,
      //     },
      //   },
      // });
        if (dto.status === DocumentStatus.VERIFIED) {
          const allVerified = await this.handleAllDocumentsVerified(
            doc.applicationId,
            tx,
            admin.id,
          );

          if (allVerified) {
            applicationsToEmit.add(doc.applicationId);
          }
        }
      }
    });

    //Emit AFTER commit
    for (const applicationId of applicationsToEmit) {
      this.eventEmitter.emit("application.document_verified", {
        applicationId,
        adminId: admin.id,
      });
    }

    return { success: true };
  }

  private async handleAllDocumentsVerified(
    applicationId: string,
    tx: Prisma.TransactionClient,
    adminId: string,
  ): Promise<boolean> {
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      select: { status: true },
    });

    if (!application) return false;

    // Idempotency guard
    if (application.status !== ApplicationStatus.APPLIED) {
      return false;
    }

    const pendingDocs = await tx.admissionDocument.count({
      where: {
        applicationId,
        status: { not: DocumentStatus.VERIFIED },
      },
    });

    if (pendingDocs > 0) return false;

    await tx.application.update({
      where: { id: applicationId },
      data: {
        reviewedBy: adminId,
        status: ApplicationStatus.DOCUMENT_VERIFIED,
        updatedAt: new Date(),
      },
    });

    await tx.audit_Logs.create({
      data: {
        action: "ALL_DOCUMENTS_VERIFIED",
        entityType: "APPLICATION",
        entityId: applicationId,
        actorId: adminId,
        metadata: {
          message: "All required documents verified",
        },
      },
    });

    return true;
  }
}
