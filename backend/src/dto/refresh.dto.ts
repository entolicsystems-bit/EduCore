import { IsString, Matches } from "class-validator";

export class RefreshDto {
  @IsString()
  @Matches(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, {
    message: "Invalid JWT token format",
  })
  refreshToken: string;
}
