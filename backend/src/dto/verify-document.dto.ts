// verify-document.dto.ts
import { IsEnum, IsOptional, IsString } from "class-validator";

export enum DocumentStatus {
  UPLOADED = "UPLOADED",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export class VerifyDocumentDto {
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}
