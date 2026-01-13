import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export enum DocumentOwnerType {
  APPLICATION = "APPLICATION",
  STUDENT = "STUDENT",
  STAFF = "STAFF",
  OTHER = "OTHER",
}

export enum DocumentType {
  ID_PROOF = "ID_PROOF",
  ADDRESS_PROOF = "ADDRESS_PROOF",
  ACADEMIC_RECORD = "ACADEMIC_RECORD",
  OTHER = "OTHER",
}

export class DocumentUploadDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  file_type: string; // MIME type

  @IsEnum(DocumentType)
  document_type: DocumentType;

  @IsString()
  application_id: string; // optional link to application

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10 * 1024 * 1024) // 10 MB max
  fileSize?: number;
}
