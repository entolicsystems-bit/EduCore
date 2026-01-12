import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { documentUploadDto } from "src/dto/document-upload-dto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";

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

  //get owner tenantId and BranchId
  private async getOwnerTenantAndBranch(owner_type: string, owner_id: string) {
    switch (owner_type) {
      case "STUDENT":
        return this.prisma.lead.findUnique({
          where: { id: owner_id },
          select: { tenantId: true, branchId: true },
        });

      case "STAFF":
        return this.prisma.user.findUnique({
          where: { id: owner_id },
          select: { tenantId: true, branchId: true },
        });

      // case "APPLICATION":
      //   return this.prisma.user.findUnique({
      //     where: { id: owner_id },
      //     select: { tenantId: true, branchId: true },
      //   });

      default:
        throw new BadRequestException("Invalid owner type");
    }
  }

  async uploadDocument(dto: documentUploadDto, reqUser: User) {
    const { fileName, file_type, owner_type, owner_id, document_type } = dto;

    //Permission check
    if (!reqUser.tenantId || !reqUser.branchId) {
      throw new ForbiddenException("Invalid tenant or branch id");
    }

    //get owner TenantId and BranchId
    const owner = await this.getOwnerTenantAndBranch(owner_type, owner_id);

    //owner not found
    if (!owner) {
      throw new BadRequestException("Owner not found");
    }

    // Cross-tenant or cross-branch blocked
    if (
      owner.tenantId !== reqUser.tenantId ||
      owner.branchId !== reqUser.branchId
    ) {
      throw new ForbiddenException(
        "You cannot upload documents outside your tenant or branch"
      );
    }

    //blocked extention
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

    //allowed extention
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "docx"];

    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension)
      throw new BadRequestException("File must have an extension");

    if (blockedExtensions.includes(extension))
      throw new BadRequestException(`Files with .${extension} are not allowed`);

    if (!allowedExtensions.includes(extension))
      throw new BadRequestException(
        `Files with .${extension} are not supported`
      );

    //allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    //check input file type
    if (!allowedTypes.includes(file_type)) {
      throw new BadRequestException("Unsupported MIME type");
    }

    try {
      //check extention and create timestamp
      const extension = fileName.split(".").pop();
      const timestamp = Date.now();

      //create unique file key
      const fileKey = `${reqUser.tenantId}/${reqUser.branchId}/${owner_type}/${owner_id}/${document_type}/${timestamp}.${extension}`;

      // create presigned URL
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileKey,
        ContentType: file_type,
        Metadata: {
          owner_type,
          owner_id: owner_id.toString(),
          document_type,
        },
      });

      //upload url
      const uploadUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 900, // 15 minutes
      });

      await this.prisma.document.create({
        data: {
          tenantId: reqUser.tenantId,
          branchId: reqUser.branchId,
          documentType: document_type,
          fileKey: fileKey,
          fileName: fileName,
          fileSize: 10,
          fileType: file_type,
          ownerId: owner_id,
          ownerType: owner_type,
          verified: false,
        },
      });

      // responce
      return {
        upload_url: uploadUrl,
        file_key: fileKey,
        expires_in: 900,
        max_size: 10 * 1024 * 1024,
        allowed_types: allowedTypes,
        document_type,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
