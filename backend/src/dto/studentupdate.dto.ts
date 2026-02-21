import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class studentProfileUpdateDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit mobile number",
  })
  phone: string;

  @IsOptional()
  @IsDateString()
  dob: Date;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  bloodGroup: string;

  @IsOptional()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  guardianName: string;

  @IsOptional()
  @IsEmail()
  guardianEmail: string;

  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit mobile number",
  })
  guardianPhone: string;

  @IsOptional()
  @IsString()
  guardianRelation: string;

  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  emergencyName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit mobile number",
  })
  emergencyPhone: string;
}
