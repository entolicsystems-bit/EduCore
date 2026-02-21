import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  name: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit mobile number",
  })
  phone: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message:
      "Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password: string;

  
  
  @IsString()
  role: string;
}
