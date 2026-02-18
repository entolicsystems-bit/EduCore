// src/common/storage/storage.service.ts
import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";

@Injectable()
export class StorageService {
  private s3 = new S3({
    region: process.env.AWS_REGION,
  });

  async uploadPdf(buffer: Buffer, key: string): Promise<string> {
    console.log("Uploading PDF to S3", {
      bucket: process.env.AWS_S3_BUCKET,
      key,
      size: buffer.length,
    });

    try {
      await this.s3
        .putObject({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: "application/pdf",
          ContentLength: buffer.length,
          ACL: "private",
        })
        .promise();

      console.log("✅ PDF uploaded successfully:", key);
      return key;
    } catch (error) {
      console.error("❌ S3 PDF upload failed:", error);
      throw error;
    }
  }

  getSignedUrl(key: string): string {
    return this.s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Expires: 300,
    });
  }
}
