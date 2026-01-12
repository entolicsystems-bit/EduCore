
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { jwtConfig } from 'src/config/jwt.config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CryptoUtil } from 'src/common/crypto/crypto.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,

  ) {}
  // ================= LOGIN =================

  async login(identifier: string, password: string) {
  // 1️⃣ Fetch all users (because encrypted fields can't be searched directly)
  const users = await this.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      passwordHash: true,
    },
  });

  // 2️⃣ Try to find matching user by decrypting
  let matchedUser = null;

  for (const user of users) {
    const decryptedEmail = user.email
      ? await CryptoUtil.decrypt(user.email)
      : null; // 🔓 decrypt email

    const decryptedPhone = user.phone
      ? await CryptoUtil.decrypt(user.phone)
      : null; // 🔓 decrypt phone

    if (decryptedEmail === identifier || decryptedPhone === identifier) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    throw new UnauthorizedException("Invalid credentials");
  }

  // 3️⃣ Check password
  const isValid = await bcrypt.compare(password, matchedUser.passwordHash);
  if (!isValid) {
    throw new UnauthorizedException("Invalid credentials");
  }

  // 4️⃣ Issue tokens
  return this.issueTokens(matchedUser.id);
}


  // ================= ISSUE TOKENS =================
  async issueTokens(userId: string) {
    // 🔥 MUST fetch tenantId & branchId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        tenantId: true,
        branchId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const jti = randomUUID();

    // ✅ ACCESS TOKEN
    const accessToken = this.jwt.sign(
      {
        sub: userId,
        role: user.role,
        tenantId: user.tenantId,
        branchId: user.branchId,
      },
      {
        secret: jwtConfig.accessSecret,
        expiresIn: jwtConfig.accessTokenExpiresIn,
      },
    );

    // ✅ REFRESH TOKEN
    const refreshToken = this.jwt.sign(
      {
        sub: userId,
        role: user.role,
        tenantId: user.tenantId,
        branchId: user.branchId,
        jti,
      },
      {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshTokenExpiresIn,
      },
    );

    await this.prisma.$transaction([
      // remove old refresh tokens
      this.prisma.refreshToken.deleteMany({
        where: { userId },
      }),

      // insert new refresh token
      this.prisma.refreshToken.create({
        data: {
          userId,
          jti,
          tokenHash: await bcrypt.hash(refreshToken, 10),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return { accessToken, refreshToken };
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

    const stored = await this.prisma.refreshToken.findFirst({
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
      await tx.refreshToken.deleteMany({
        where: { userId: payload.sub },
      });

      // ✅ NEW ACCESS TOKEN
      const newAccessToken = this.jwt.sign(
        {
          sub: payload.sub,
          role: payload.role,
          tenantId: payload.tenantId,
          branchId: payload.branchId,
        },
        {
          secret: jwtConfig.accessSecret,
          expiresIn: jwtConfig.accessTokenExpiresIn,
        },
      );

      // ✅ NEW REFRESH TOKEN
      const newRefreshToken = this.jwt.sign(
        {
          sub: payload.sub,
          role: payload.role,
          tenantId: payload.tenantId,
          branchId: payload.branchId,
          jti: newJti,
        },
        {
          secret: jwtConfig.refreshSecret,
          expiresIn: jwtConfig.refreshTokenExpiresIn,
        },
      );

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

    await this.prisma.refreshToken.deleteMany({
      where: { userId: payload.sub },
    });

    return { message: 'Logged out successfully' };
  }
}
