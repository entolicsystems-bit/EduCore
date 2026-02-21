import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsUUID,
  IsEnum
} from "class-validator";
import { Type } from "class-transformer";
import { CourseStatus, DurationType } from "@prisma/client";
import { SubjectJsonDto } from "./subject-json.dto";
//import { SubjectJsonDto } from "./subject-json.dto.ts";

export class CreateCourseDto {

  // @IsUUID()
  // tenantId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectJsonDto)
  subjects?: SubjectJsonDto[];

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsEnum(DurationType)
  durationType?: DurationType;
}
