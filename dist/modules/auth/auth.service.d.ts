import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
export declare class AuthService {
    private readonly jwt;
    private readonly prisma;
    constructor(jwt: JwtService, prisma: PrismaService);
    login(email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
