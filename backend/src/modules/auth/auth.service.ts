import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/database/prisma.service";
import { jwtConfig } from "src/config/jwt.config";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { CryptoUtil } from "src/common/crypto/crypto.util";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  // ================= LOGIN =================
  async login(identifier: string, password: string) {
    // Fetch all users (encrypted fields)
    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, phone: true, passwordHash: true },
    });

    let matchedUser = null;
    for (const user of users) {
      const decryptedEmail = user.email ? await CryptoUtil.decrypt(user.email) : null;
      const decryptedPhone = user.phone ? await CryptoUtil.decrypt(user.phone) : null;

      if (decryptedEmail === identifier || decryptedPhone === identifier) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) throw new UnauthorizedException("Invalid credentials");

    const isValid = await bcrypt.compare(password, matchedUser.passwordHash);
    if (!isValid) throw new UnauthorizedException("Invalid credentials");

    return this.issueTokens(matchedUser.id);
  }

  // ================= ISSUE TOKENS =================
  async issueTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, tenantId: true, branchId: true },
    });
    if (!user) throw new UnauthorizedException("User not found");

    const jti = randomUUID();

    // ACCESS TOKEN
    const accessToken = this.jwt.sign(
      {
        sub: userId,
        role: user.role,
        tenantId: user.tenantId,
        branchId: user.branchId,
      },
      { secret: jwtConfig.accessSecret, expiresIn: jwtConfig.accessTokenExpiresIn }
    );

    // REFRESH TOKEN
    const refreshToken = this.jwt.sign(
      {
        sub: userId,
        role: user.role,
        tenantId: user.tenantId,
        branchId: user.branchId,
        jti,
      },
      { secret: jwtConfig.refreshSecret, expiresIn: jwtConfig.refreshTokenExpiresIn }
    );

    await this.prisma.$transaction([
      // remove old refresh tokens
      this.prisma.refreshToken.deleteMany({ where: { userId } }),
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
      payload = this.jwt.verify(oldToken, { secret: jwtConfig.refreshSecret });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Check token by userId + jti
    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId: payload.sub, jti: payload.jti },
    });

    if (!stored) throw new ForbiddenException("Refresh token not recognized");
    if (stored.expiresAt < new Date()) throw new ForbiddenException("Refresh token expired");

    const valid = await bcrypt.compare(oldToken, stored.tokenHash);
    if (!valid) throw new ForbiddenException("Invalid refresh token");

    const newJti = randomUUID();

    return this.prisma.$transaction(async (tx) => {
      // Delete only the used token
      await tx.refreshToken.delete({ where: { id: stored.id } });

      // Fetch user info
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { role: true, tenantId: true, branchId: true },
      });
      if (!user) throw new UnauthorizedException("User not found");

      const newAccessToken = this.jwt.sign(
        {
          sub: payload.sub,
          role: user.role,
          tenantId: user.tenantId,
          branchId: user.branchId,
        },
        { secret: jwtConfig.accessSecret, expiresIn: jwtConfig.accessTokenExpiresIn }
      );

      const newRefreshToken = this.jwt.sign(
        {
          sub: payload.sub,
          role: user.role,
          tenantId: user.tenantId,
          branchId: user.branchId,
          jti: newJti,
        },
        { secret: jwtConfig.refreshSecret, expiresIn: jwtConfig.refreshTokenExpiresIn }
      );

      await tx.refreshToken.create({
        data: {
          userId: payload.sub,
          jti: newJti,
          tokenHash: await bcrypt.hash(newRefreshToken, 10),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    });
  }

  // ================= LOGOUT =================
  async logout(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwt.verify(refreshToken, { secret: jwtConfig.refreshSecret });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.prisma.refreshToken.deleteMany({ where: { userId: payload.sub } });
    return { message: "Logged out successfully" };
  }
}
