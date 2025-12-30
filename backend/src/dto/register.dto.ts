import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: "Name must be 2–100 characters" })
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
