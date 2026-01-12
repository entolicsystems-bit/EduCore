import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  VerificationStatus,
  VerifyDocumentDto,
} from 'src/dto/verify-document.dto';

@Injectable()
export class VerifyDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  //single document verify
  async verifyOneDocument(
    documentId: string,
    dto: VerifyDocumentDto,
    admin: User,
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new BadRequestException('Document not found');
    if (document.verified) throw new BadRequestException('Document already verified');

    const isVerified = dto.status === VerificationStatus.VERIFIED;

    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        verified: isVerified,
        verifiedBy: admin.id,
        verifiedAt: new Date(),
      },
    });

    return { success: true };
  }

  async bulkVerifyDocuments(
    documentIds: string[],
    dto: VerifyDocumentDto,
    admin: User,
  ) {
    if (!documentIds || documentIds.length === 0) {
      throw new BadRequestException('Document IDs are required');
    }

    const documents = await this.prisma.document.findMany({
      where: { id: { in: documentIds } },
    });

    if (documents.length !== documentIds.length) {
      throw new BadRequestException('One or more documents not found');
    }

    const alreadyVerified = documents.filter(d => d.verified);
    if (alreadyVerified.length > 0) {
      throw new BadRequestException('Some documents are already verified');
    }

    const isVerified = dto.status === VerificationStatus.VERIFIED;

    await this.prisma.document.updateMany({
      where: { id: { in: documentIds } },
      data: {
        verified: isVerified,
        verifiedBy: admin.id,
        verifiedAt: new Date(),
      },
    });

    return {
      success: true,
      verifiedCount: documentIds.length,
    };
  }
}
