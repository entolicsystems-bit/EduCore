import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { jwtConfig } from 'src/config/jwt.config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}



  // ================= LOGIN =================
  async login(email: string, password: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 🔹 get tokens
  const tokens = await this.issueTokens(user.id);

  // 🔹 return tokens
  return {
    ...tokens,
  };
}


  // ================= ISSUE TOKENS =================
async issueTokens(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const jti = randomUUID();

  const accessToken = this.jwt.sign(
    { sub: userId, role: user?.role },
    {
      secret: jwtConfig.accessSecret,
      expiresIn: jwtConfig.accessTokenExpiresIn,
    },
  );

  const refreshToken = this.jwt.sign(
    { sub: userId, role: user?.role, jti },
    {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshTokenExpiresIn,
    },
  );

  await this.prisma.$transaction([
    // 🔥 remove old refresh token
    this.prisma.refreshToken.deleteMany({
      where: { userId },
    }),

    // 🔥 insert new refresh token
    this.prisma.refreshToken.create({
      data: {
        userId,
        jti,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  return { accessToken, refreshToken 
  };
}


  // ================= REFRESH TOKEN =================
async refreshToken(oldToken: string) {
  let payload: any;

  try {
    payload = this.jwt.verify(oldToken, {
      secret: jwtConfig.refreshSecret,
    });
  } catch {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const stored = await this.prisma.refreshToken.findUnique({
    where: { userId: payload.sub },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ForbiddenException('Refresh token expired');
  }

  const valid = await bcrypt.compare(oldToken, stored.tokenHash);
  if (!valid) {
    throw new ForbiddenException('Invalid refresh token');
  }

  const newJti = randomUUID();

  return this.prisma.$transaction(async (tx) => {
    // 🔥 DELETE r1
    await tx.refreshToken.delete({
      where: { userId: payload.sub },
    });

    const newAccessToken = this.jwt.sign(
      { sub: payload.sub, role: payload.role },
      {
        secret: jwtConfig.accessSecret,
        expiresIn: jwtConfig.accessTokenExpiresIn,
      },
    );

    const newRefreshToken = this.jwt.sign(
      { sub: payload.sub, role: payload.role, jti: newJti },
      {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshTokenExpiresIn,
      },
    );

    // 🔥 INSERT r2
    await tx.refreshToken.create({
      data: {
        userId: payload.sub,
        jti: newJti,
        tokenHash: await bcrypt.hash(newRefreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  });
}



  // ================= LOGOUT =================
async logout(refreshToken: string) {
  let payload: any;

  try {
    payload = this.jwt.verify(refreshToken, {
      secret: jwtConfig.refreshSecret,
    });
  } catch {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const stored = await this.prisma.refreshToken.findUnique({
    where: { userId: payload.sub },
  });

  if (!stored) {
    return{message:'No active session'};
  }

  // 🔥 CRITICAL CHECK (THIS WAS MISSING)
  if (stored.jti !== payload.jti) {
     return {message: 'Refresh token already rotated'};
  }

  // 🔐 secondary safety
  const valid = await bcrypt.compare(refreshToken, stored.tokenHash);
  if (!valid) {
    return {message:"Logout already done session expired"};
  }

  await this.prisma.refreshToken.delete({
    where: { userId: payload.sub },
  });

  return { message: 'Logged out successfully' };
}
}