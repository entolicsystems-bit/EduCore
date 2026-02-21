import {
  IsNotEmpty,
  IsString,
  Length,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AssignTeacherDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  teacherId: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsString()
  @IsNotEmpty()
  @IsIn(['PRIMARY', 'ASSISTANT'], {
    message: 'role must be PRIMARY or ASSISTANT',
  })
  role: string;
}