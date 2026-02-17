import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsUUID
} from "class-validator";
import { Type } from "class-transformer";

class SubjectJsonDto {

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  credits: number;
}

export class CreateCourseDto {

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  duration: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectJsonDto)
  subjects: SubjectJsonDto[];

  @IsUUID()
  branch_id: string;

  @IsUUID()
  tenant_id: string;
}
