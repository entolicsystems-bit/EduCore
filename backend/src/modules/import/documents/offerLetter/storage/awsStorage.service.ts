// src/common/storage/storage.service.ts
import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";

@Injectable()
export class StorageService {
  private s3 = new S3({ region: process.env.AWS_REGION });

  async uploadPdf(buffer: Buffer, key: string) {
    console.log("Uploading pdf");
    await this.s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: "application/pdf",
        ACL: "private",
      })
      .promise();

    return key;
  }

  getSignedUrl(key: string) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Expires: 300, // 5 minutes
    });
  }
}
