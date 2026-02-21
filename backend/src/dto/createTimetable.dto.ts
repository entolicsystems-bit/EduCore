import { IsString } from "class-validator";

export class CreateTimetableDto {
  @IsString()
  day: string;

  @IsString()
  slot: string;

  @IsString()
  subject: string;
}
