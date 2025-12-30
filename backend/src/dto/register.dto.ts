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
    message: "Invalid phone number",
  })
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  role: string;
}
