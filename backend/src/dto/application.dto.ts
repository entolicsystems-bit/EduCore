import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsUUID, IsNotEmpty, IsString, IsObject, IsUrl } from "class-validator";

export class CreateApplicationDto {
  /**
   * Lead ID from which the application is created
   * Must be a valid UUID
   */
  @IsUUID()
  @IsNotEmpty()
  leadId: string;

  /**
   * Program ID for which the student is applying
   * Stored as string in Sprint-2
   */
  @IsUUID()
  programId: string;

  /**
   * Dynamic application form data
   * Stored as JSONB in database
   */
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        throw new BadRequestException("Invalid JSON format in formData");
      }
    }
    return value;
  })
  @IsObject()
  @IsNotEmpty()
  formData: Record<string, any>;
}
