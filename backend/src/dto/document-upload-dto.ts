import { IsEnum, IsInt, IsString } from "class-validator";

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

export class documentUploadDto {
  @IsString({
    message: "File name required",
  })
  fileName: string;

  @IsString()
  file_type: string; // MIME type

  @IsEnum(DocumentOwnerType)
  owner_type: DocumentOwnerType;

  @IsInt()
  owner_id: number;

  @IsEnum(DocumentType)
  document_type: DocumentType;
}
