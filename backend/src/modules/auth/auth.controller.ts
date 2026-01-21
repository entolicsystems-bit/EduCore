import { Controller, Post, Body, Req } from "@nestjs/common";
import { Throttle, SkipThrottle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/dto/login.dto";
import { RefreshDto } from "src/dto/refresh.dto";

@Controller("v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    const identifier = dto.email || dto.phone;
    return this.authService.login(identifier, dto.password);
  }

  @Post("refresh")
  @SkipThrottle()
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post("logout")
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
