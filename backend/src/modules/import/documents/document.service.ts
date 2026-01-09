import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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

  async uploadDocument(dto: documentUploadDto, user: User) {
    const { fileName, file_type, owner_type, owner_id, document_type } = dto;

    //Permission check
    if (!user.tenantId || !user.branchId) {
      throw new ForbiddenException("Invalid tenant or branch id");
    }

    //allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    //check input file type
    if (!allowedTypes.includes(file_type)) {
      throw new BadRequestException("Unsupported file type");
    }

    //check extention and create timestamp
    const extension = fileName.split(".").pop();
    const timestamp = Date.now();

    //create unique file key
    const fileKey = `${user.tenantId}/${user.branchId}/${owner_type}/${owner_id}/${document_type}/${timestamp}.${extension}`;

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

    // responce
    return {
      upload_url: uploadUrl,
      file_key: fileKey,
      expires_in: 900,
      max_size: 10 * 1024 * 1024,
      allowed_types: allowedTypes,
      document_type,
    };
  }
}
