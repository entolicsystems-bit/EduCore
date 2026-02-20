import { IsString, IsInt } from "class-validator";

export class SubjectJsonDto {

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  credits: number;
}
