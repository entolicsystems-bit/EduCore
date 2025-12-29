import { IsEmail, IsNotEmpty, IsEnum, IsString } from "class-validator";

export class CreateStudentCsvDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  phone: string;

  source: string;
}
