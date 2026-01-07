import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsObject,
} from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  programId: string;

  /**
   * Dynamic application form data
   * Stored as JSONB in database
   */
  @IsObject()
  @IsNotEmpty()
  formData: Record<string, any>;
}
