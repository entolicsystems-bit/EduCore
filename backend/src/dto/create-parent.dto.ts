import { IsString, IsUUID, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateParentDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  branchId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  relationship: string; // FATHER / MOTHER / GUARDIAN

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];
}