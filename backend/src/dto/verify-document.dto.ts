// verify-document.dto.ts
import { IsEnum, IsOptional, IsString } from "class-validator";

export enum VerificationStatus {
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export class VerifyDocumentDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}
