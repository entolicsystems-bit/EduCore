import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaService } from "src/database/prisma.service";
import { User, DocumentStatus, DocumentOwnerType } from "@prisma/client";
import { DocumentUploadDto } from "src/dto/document-upload-dto";

@Injectable()
export class documentService {
  constructor(private readonly prisma: PrismaService) {}

  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // Get owner tenant & branch
  // private async getOwnerTenantAndBranch(ownerType: DocumentOwnerType, ownerId: string) {
  //   switch (ownerType) {
  //     case DocumentOwnerType.STUDENT:
  //       return this.prisma.lead.findUnique({
  //         where: { id: ownerId },
  //         select: { tenantId: true, branchId: true },
  //       });
  //     case DocumentOwnerType.STAFF:
  //       return this.prisma.user.findUnique({
  //         where: { id: ownerId },
  //         select: { tenantId: true, branchId: true },
  //       });
  //     default:
  //       throw new BadRequestException("Invalid owner type");
  //   }
  // }

  async uploadDocument(dto: DocumentUploadDto, reqUser: User) {
    const { fileName, file_type, document_type, fileSize, application_id } =
      dto;

    if (!reqUser.tenantId || !reqUser.branchId) {
      throw new ForbiddenException("Invalid tenant or branch");
    }

    // Extensions
    const blockedExtensions = [
      "exe",
      "bat",
      "cmd",
      "sh",
      "js",
      "jar",
      "vbs",
      "scr",
      "msi",
      "com",
    ];
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "docx"];
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension)
      throw new BadRequestException("File must have an extension");
    if (blockedExtensions.includes(extension))
      throw new BadRequestException(`Files with .${extension} are blocked`);
    if (!allowedExtensions.includes(extension))
      throw new BadRequestException(
        `Files with .${extension} are not supported`
      );

    // Double extension check (e.g., file.pdf.exe)
    const baseName = fileName.split(".").slice(0, -1).join(".");
    if (baseName.split(".").some((ext) => blockedExtensions.includes(ext))) {
      throw new BadRequestException("Filename contains forbidden extensions");
    }

    // MIME types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file_type))
      throw new BadRequestException("Unsupported MIME type");

    // File size
    if (fileSize && fileSize > 10 * 1024 * 1024)
      throw new BadRequestException("File exceeds max size of 10MB");

    try {
      const timestamp = Date.now();
      const fileKey = `${reqUser.tenantId}/${reqUser.branchId}/${document_type}/${timestamp}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileKey,
        ContentType: file_type,
        Metadata: {
          document_type,
          file_size: fileSize?.toString() || "0",
        },
      });

      const uploadUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 900,
      });

      // Save document in DB
      const document = await this.prisma.admissionDocument.create({
        data: {
          applicationId: application_id, // if optional, consider nullable in schema
          documentType: document_type,
          fileKey,
          fileName,
          fileSize: BigInt(fileSize || 0),
          fileType: file_type,
          status: DocumentStatus.UPLOADED,
        },
      });

      // Audit log
      await this.prisma.audit_Logs.create({
        data: {
          action: "UPLOAD_DOCUMENT",
          entityType: "ADMISSION_DOCUMENT",
          entityId: document.id,
          actorId: reqUser.id,
          metadata: { fileName, fileKey, documentType: document_type },
        },
      });

      return {
        upload_url: uploadUrl,
        file_key: fileKey,
        expires_in: 900,
        max_size: 10 * 1024 * 1024,
        allowed_types: allowedTypes,
        document_type,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to upload document");
    }
  }
}
