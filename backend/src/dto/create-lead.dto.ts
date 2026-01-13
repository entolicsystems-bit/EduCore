import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  Length,
} from "class-validator";

export class CreateLeadDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  name: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Invalid phone number",
  })
  phone: string;

  @IsEmail({}, { message: "Invalid email address" })
  email?: string;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Matches(/^[A-Za-z]+$/, {
    message: "Source must contain only letters",
  })
  source: string;
}
