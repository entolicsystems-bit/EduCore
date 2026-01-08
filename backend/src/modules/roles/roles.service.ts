import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RegisterDto } from "src/dto/register.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async assignRole(userId: string, roleId: number) {
    const exists = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: { userId, roleId },
      },
    });

    if (exists) return exists; // Already assigned

    return this.prisma.userRole.create({
      data: { userId, roleId },
    });
  }

  async registerStaff(dto: RegisterDto, adminId: string) {
    try {
      const { email, name, phone, password } = dto;
      const roleName = dto.role.toUpperCase();

      const allowedRoles = ["COUNSELLOR", "TEACHER", "ACCOUNTANT"];
      if (!allowedRoles.includes(roleName)) {
        throw new BadRequestException("Invalid role");
      }

      const [emailExists, phoneExists] = await Promise.all([
        this.prisma.user.findUnique({ where: { email } }),
        this.prisma.user.findUnique({ where: { phone } }),
      ]);

      if (emailExists) throw new BadRequestException("Email already exists");
      if (phoneExists) throw new BadRequestException("PhoneNo already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          phone,
          role: roleName,
          passwordHash: hashedPassword,
        },
      });

      const roleMap = {
        COUNSELLOR: 2,
        TEACHER: 3,
        ACCOUNTANT: 4,
      };

      await this.assignRole(user.id, roleMap[roleName]);

      const { passwordHash: _, ...safeUser } = user;

      await this.prisma.auditLog.create({
        data: {
          tableName: "User",
          action: "AssignRole",
          oldValue: null,
          newValue: user,
          userId: adminId,
        },
      });
      return safeUser;
    } catch (error) {
      console.error("registerStaff failed:", error);
      throw error;
    }
  }
}
