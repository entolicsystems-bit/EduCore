import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

  async registerStaff(dto: RegisterDto) {
    const email = dto.email;
    const name = dto.name;
    const phone = dto.phone;
    const password = dto.password;
    const roleName = dto.role.toUpperCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }
    const existingPhone = await this.prisma.user.findFirst({
      where: { phone },
    });
    if (existingPhone) {
      throw new BadRequestException("PhoneNo already exists");
    }

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
    if (roleName === "COUNSELLOR") this.assignRole(user.id, 2);
    else if (roleName === "TEACHER") this.assignRole(user.id, 3);
    else if (roleName === "ACCOUNTANT") this.assignRole(user.id, 4);
    else throw new BadRequestException("Invalid Role");

    const { passwordHash: _, ...result } = user;

    return result;
  }
}
