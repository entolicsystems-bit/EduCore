import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { VerifyDocumentDto } from "./verify-document.dto";

export class BulkVerifyDocumentsDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  documentIds: string[];

  @ValidateNested()
  @Type(() => VerifyDocumentDto)
  info: VerifyDocumentDto;
}
