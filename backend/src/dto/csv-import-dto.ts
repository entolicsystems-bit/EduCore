import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  Matches,
  Length,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateStudentCsvDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  name: string;

  @IsEmail()
  @IsNotEmpty({
    message: "Email is required",
  })
  email: string;

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone is required" })
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone must be a valid 10-digit mobile number",
  })
  phone: string;
}
