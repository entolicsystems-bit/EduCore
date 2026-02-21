import { StaffStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^[0-9]{10}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  role: string; // TEACHER | COUNSELLOR | ACCOUNTANT

  @IsOptional()
  @IsString()
  department?: string;

   @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(StaffStatus, {
    message: "Status must be ACTIVE or INACTIVE",
  })
  status?: StaffStatus;
}