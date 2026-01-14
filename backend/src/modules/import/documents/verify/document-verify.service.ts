import { BadRequestException, Injectable } from "@nestjs/common";
import { DocumentStatus, User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { VerifyDocumentDto } from "src/dto/verify-document.dto";

@Injectable()
export class VerifyDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  //single document verification
  async verifyOneDocument(
    documentId: string,
    dto: VerifyDocumentDto,
    admin: User
  ) {
    //Find document
    const document = await this.prisma.admissionDocument.findUnique({
      where: { id: documentId },
    });

    //Given document not found
    if (!document) {
      throw new BadRequestException("Document not found");
    }

    //Document already Verified or Rejected
    if (document.status !== DocumentStatus.UPLOADED) {
      throw new BadRequestException("Document already processed");
    }

    //Update table
    await this.prisma.$transaction(async (tx) => {
      const updateDoc = await tx.admissionDocument.update({
        where: { id: documentId },
        data: {
          status: dto.status, // VERIFIED or REJECTED
          verifiedBy: admin.id,
          verifiedAt: new Date(),
        },
      });

      //Create audit logs
      await tx.audit_Logs.create({
        data: {
          action: "VERIFY_DOCUMENT",
          entityType: "ADMISSION_DOCUMENT",
          entityId: documentId,
          actorId: admin.id,
          metadata: {
            documentId: documentId,
            Status: dto.status,
            Comments: dto.comments,
          },
        },
      });

      // if (dto.status === DocumentStatus.VERIFIED) {
      //   await this.handleAllDocumentVerified(updateDoc.applicationId, tx);
      // }
    });

    return { success: true };
  }

  //bulk verification
  async bulkVerifyDocuments(
    documentIds: string[],
    dto: VerifyDocumentDto,
    admin: User
  ) {
    //documents ID not given
    if (!documentIds || documentIds.length === 0) {
      throw new BadRequestException("Document IDs are required");
    }

    const documents = await this.prisma.admissionDocument.findMany({
      where: { id: { in: documentIds } },
    });

    //Given document is not present
    if (documents.length !== documentIds.length) {
      throw new BadRequestException("One or more documents not found");
    }

    //Some of given documents are already Verified or Rejected
    const alreadyProcessed = documents.some(
      (d) => d.status !== DocumentStatus.UPLOADED
    );

    if (alreadyProcessed) {
      throw new BadRequestException("Some documents are already processed");
    }

    //update the status and verifyUser details
      const result = await this.prisma.admissionDocument.updateMany({
        where: {
          id: { in: documentIds },
          status: DocumentStatus.UPLOADED,
        },
        data: {
          status: dto.status, // VERIFIED or REJECTED
          verifiedBy: admin.id,
          verifiedAt: new Date(),
        },
      });

      //Create audit logs in bulk
      await this.prisma.audit_Logs.createMany({
        data: documentIds.map((documentId) => ({
          action: "VERIFY_DOCUMENT",
          entityType: "ADMISSION_DOCUMENT",
          entityId: documentId,
          actorId: admin.id,
          metadata: {
            documentId,
            status: dto.status,
            comments: dto.comments,
            bulkOperation: true,
          },
        })),
      });

      // const applicationIds = [
      //   ...new Set(documents.map((d) => d.applicationId)),
      // ];

       // for (const appId of applicationIds) {
       //   await this.handleAllDocumentsVerified(appId, tx);
       // }

      //Return success and count of documents
      return {
        success: true,
        verifiedCount: result.count,
      };
   
  }
}
