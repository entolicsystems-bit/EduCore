import { Controller, Post, Body } from '@nestjs/common'; //  //it is store in node modules and it contain all guards routes pipes exception etc.
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { RefreshDto } from 'src/dto/refresh.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
 const identifier = dto.email || dto.phone;
  return this.authService.login(identifier, dto.password); 
 }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshToken(dto.refreshToken)
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken)
  }
  
}
