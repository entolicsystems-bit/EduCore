import { IsString, IsInt, IsDateString, IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  capacity: number;

  @IsUUID()
  courseId: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @IsObject()
  @IsOptional()
  timetable?: Record<string, any>;
}