import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ApplicationStatus,
  DocumentStatus,
  Prisma,
  User,
} from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { VerifyDocumentDto } from "src/dto/verify-document.dto";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class VerifyDocumentService {
  constructor(
<<<<<<< HEAD
  private readonly prisma: PrismaService,
  private readonly eventEmitter: EventEmitter2,
) {}

=======
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
>>>>>>> 8cc402e601a3ec20463ea2a9ea082e3dda52cdfc

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

    console.log(
  '🚀 EMITTING application.document_verified',
  applicationsToEmit,
);

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

<<<<<<< HEAD

    return true; // 
=======
    return true;
>>>>>>> 8cc402e601a3ec20463ea2a9ea082e3dda52cdfc
  }
}


// import { BadRequestException, Injectable } from "@nestjs/common";
// import { ApplicationStatus, DocumentStatus, Prisma, User } from "@prisma/client";
// import { PrismaService } from "src/database/prisma.service";
// import { VerifyDocumentDto } from "src/dto/verify-document.dto";
// import { EventEmitter2 } from '@nestjs/event-emitter';

// @Injectable()
// export class VerifyDocumentService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly eventEmitter: EventEmitter2,
//   ) {}

//   async verifyOneDocument(
//     documentId: string,
//     dto: VerifyDocumentDto,
//     admin: User
//   ) {
//     // 🔍 DEBUG: verify endpoint hit
//     console.log(
//       '🟢 verifyOneDocument CALLED',
//       { documentId, status: dto.status }
//     );

//     let shouldEmit = false;
//     let applicationIdToEmit: string | null = null;

//     const document = await this.prisma.admissionDocument.findUnique({
//       where: { id: documentId },
//     });

//     if (!document) {
//       console.log('❌ Document not found');
//       throw new BadRequestException("Document not found");
//     }

//     if (document.status !== DocumentStatus.UPLOADED) {
//       console.log('❌ Document already processed:', document.status);
//       throw new BadRequestException("Document already processed");
//     }

//     await this.prisma.$transaction(async (tx) => {
//       const updatedDoc = await tx.admissionDocument.update({
//         where: { id: documentId },
//         data: {
//           status: dto.status,
//           verifiedBy: admin.id,
//           verifiedAt: new Date(),
//         },
//       });

//       console.log(
//         '📄 Document updated:',
//         updatedDoc.id,
//         updatedDoc.status,
//       );

//       await tx.audit_Logs.create({
//         data: {
//           action: "VERIFY_DOCUMENT",
//           entityType: "ADMISSION_DOCUMENT",
//           entityId: documentId,
//           actorId: admin.id,
//           metadata: {
//             status: dto.status,
//             comments: dto.comments,
//           },
//         },
//       });

//       if (dto.status === DocumentStatus.VERIFIED) {
//         console.log(
//           '🔎 Checking if ALL documents are verified for application:',
//           updatedDoc.applicationId,
//         );

//         const allVerified = await this.handleAllDocumentsVerified(
//           updatedDoc.applicationId,
//           tx,
//           admin.id
//         );

//         console.log(
//           '✅ handleAllDocumentsVerified returned:',
//           allVerified,
//         );

//         if (allVerified) {
//           shouldEmit = true;
//           applicationIdToEmit = updatedDoc.applicationId;
//         }
//       }
//     });

//     // EVENT AFTER TRANSACTION COMMIT
//     if (shouldEmit && applicationIdToEmit) {
//       console.log(
//         '🚀 EMITTING application.document_verified',
//         applicationIdToEmit,
//       );

//       this.eventEmitter.emit("application.document_verified", {
//         applicationId: applicationIdToEmit,
//         adminId: admin.id,
//       });
//     } else {
//       console.log(
//         '⚠️ Event NOT emitted',
//         { shouldEmit, applicationIdToEmit }
//       );
//     }

//     return { success: true };
//   }

//   async bulkVerifyDocuments(
//     documentIds: string[],
//     dto: VerifyDocumentDto,
//     admin: User
//   ) {
//     console.log(
//       '🟢 bulkVerifyDocuments CALLED',
//       documentIds,
//     );

//     let applicationsToEmit = new Set<string>();

//     await this.prisma.$transaction(async (tx) => {
//       const documents = await tx.admissionDocument.findMany({
//         where: { id: { in: documentIds } },
//       });

//       for (const doc of documents) {
//         if (dto.status === DocumentStatus.VERIFIED) {
//           const allVerified = await this.handleAllDocumentsVerified(
//             doc.applicationId,
//             tx,
//             admin.id
//           );

//           console.log(
//             '📄 Bulk check result',
//             doc.applicationId,
//             allVerified,
//           );

//           if (allVerified) {
//             applicationsToEmit.add(doc.applicationId);
//           }
//         }
//       }
//     });

//     console.log(
//       '🚀 BULK EMIT applications:',
//       [...applicationsToEmit],
//     );

//     for (const applicationId of applicationsToEmit) {
//       this.eventEmitter.emit("application.document_verified", {
//         applicationId,
//         adminId: admin.id,
//       });
//     }

//     return { success: true };
//   }

//   private async handleAllDocumentsVerified(
//     applicationId: string,
//     tx: Prisma.TransactionClient,
//     adminId: string
//   ): Promise<boolean> {

//     console.log(
//       '🔎 handleAllDocumentsVerified START',
//       applicationId,
//     );

//     const application = await tx.application.findUnique({
//       where: { id: applicationId },
//       select: { status: true },
//     });

//     if (!application) {
//       console.log('❌ Application not found');
//       return false;
//     }

//     // 🔍 DEBUG: current application status
//     console.log(
//       '📌 Current application status:',
//       application.status,
//     );

//     // Idempotency guard (NO CHANGE)
//     if (application.status !== ApplicationStatus.APPLIED) {
//       console.log(
//         '❌ Status is NOT APPLIED, returning false',
//       );
//       return false;
//     }

//     const pendingDocs = await tx.admissionDocument.count({
//       where: {
//         applicationId,
//         status: { not: DocumentStatus.VERIFIED },
//       },
//     });

//     console.log(
//       '📂 Pending documents count:',
//       pendingDocs,
//     );

//     if (pendingDocs > 0) return false;

//     await tx.application.update({
//       where: { id: applicationId },
//       data: {
//         reviewedBy: adminId,
//         status: ApplicationStatus.DOCUMENT_VERIFIED,
//         updatedAt: new Date(),
//       },
//     });

//     console.log(
//       '🎉 Application marked DOCUMENT_VERIFIED:',
//       applicationId,
//     );

//     await tx.audit_Logs.create({
//       data: {
//         action: "ALL_DOCUMENTS_VERIFIED",
//         entityType: "APPLICATION",
//         entityId: applicationId,
//         actorId: adminId,
//         metadata: {
//           message: "All required documents verified",
//         },
//       },
//     });

//     return true;
//   }
// }
