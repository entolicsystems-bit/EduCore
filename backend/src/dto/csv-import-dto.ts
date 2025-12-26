import { IsEmail, IsNotEmpty, IsEnum, IsString } from "class-validator";

export class CreateStudentCsvDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(["ADMIN", "USER"])
  role: "ADMIN" | "USER";
}
