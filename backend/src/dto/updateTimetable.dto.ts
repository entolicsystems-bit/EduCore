import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsArray,
  Matches,
  Length,
} from "class-validator";
import { Type } from "class-transformer";

export class TimetableSlot {
  @IsString()
  @IsNotEmpty({ message: "Slot must not be empty" })
  slot: string;

  @IsString({ message: "subject must be a string" })
  @IsNotEmpty({ message: "subject is required" })
  @Length(2, 50, { message: "subject must be 2–50 characters long" })
  subject: string;

  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  @Length(2, 50, { message: "Name must be 2–50 characters long" })
  teacher?: string;
}

// UpdateTimetable DTO
export class UpdateTimetable {
  @IsObject({ message: "Timetable must be an object" })
  timetable: Record<string, any>;
}
