import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // ===================== LOGIN =====================
  async login(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: jwtConfig.accessSecret,
      expiresIn: jwtConfig.accessTokenExpiresIn, // 15 min
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshTokenExpiresIn, // 7 days
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // ===================== REFRESH =====================
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: jwtConfig.refreshSecret, // ✅ refresh secret
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwt.sign(
        {
          sub: user.id,
          role: user.role,
        },
        {
          secret: jwtConfig.accessSecret,
          expiresIn: jwtConfig.accessTokenExpiresIn,
        },
      );

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
