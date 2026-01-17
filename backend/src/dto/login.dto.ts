import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator'

export class LoginDto {
  @ValidateIf(o => !o.phone)      // if phone is missing → email is required
  @IsString()
  email?: string;

  @ValidateIf(o => !o.email)      // if email is missing → phone is required
  @IsString()
  phone?: string;

  @IsString()
  password: string
}
