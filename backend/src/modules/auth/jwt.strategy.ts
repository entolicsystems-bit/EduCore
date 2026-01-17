import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "../../config/jwt.config";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.accessSecret,
    });
  }

  async validate(payload: any) {
    // Always validate user exists in DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, tenantId: true, branchId: true },
    });

    if (!user) throw new UnauthorizedException("Invalid user");
    return user; // req.user
  }
}
