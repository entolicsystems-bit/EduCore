import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RegisterDto } from "src/dto/register.dto";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { CryptoUtil } from "src/common/crypto/crypto.util"; // 🔐 add this

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

  async registerStaff(dto: RegisterDto, reqUser: User) {
    try {
      const { email, name, phone, password } = dto;
      const roleName = dto.role.toUpperCase();

      const allowedRoles = [
        "COUNSELLOR",
        "TEACHER",
        "ACCOUNTANT",
        "PARENT",
        "STUDENT",
      ];
      if (!allowedRoles.includes(roleName)) {
        throw new BadRequestException("Invalid role");
      }

      // 🔐 Encrypt fields for DB comparison
      const encryptedEmail = await CryptoUtil.encrypt(email);
      const encryptedPhone = await CryptoUtil.encrypt(phone);

      // 🔍 Check uniqueness on encrypted values
      const [emailExists, phoneExists] = await Promise.all([
        this.prisma.user.findUnique({ where: { email: encryptedEmail } }), // 🔐
        this.prisma.user.findFirst({ where: { phone: encryptedPhone } }), // 🔐
      ]);

      if (emailExists) throw new BadRequestException("Email already exists");
      if (phoneExists) throw new BadRequestException("PhoneNo already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: encryptedEmail, // 🔐
          name: await CryptoUtil.encrypt(name), // 🔐
          phone: encryptedPhone, // 🔐
          role: roleName,
          tenantId: reqUser.tenantId,
          branchId: reqUser.branchId,
          passwordHash: hashedPassword,
        },
      });

      const roleMap = {
        COUNSELLOR: 2,
        TEACHER: 3,
        ACCOUNTANT: 4,
        PARENT: 5,
        STUDENT: 6,
      };

      await this.assignRole(user.id, roleMap[roleName]);

      const { passwordHash: _, ...safeUser } = user;

      await this.prisma.auditLog.create({
        data: {
          tableName: "User",
          action: "AssignRole",
          oldValue: null,
          newValue: user,
          userId: reqUser.id,
        },
      });
      return safeUser;
    } catch (error) {
      console.error("registerStaff failed:", error);
      throw error;
    }
  }

  async getAllStaff() {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: ["COUNSELLOR", "TEACHER", "ACCOUNTANT", "PARENT", "STUDENT"],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      users.map(async (u) => ({
        id: u.id,
        name: await CryptoUtil.decrypt(u.name), // 🔓
        email: await CryptoUtil.decrypt(u.email), // 🔓
        phone: await CryptoUtil.decrypt(u.phone), // 🔓
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      }))
    );
  }

  async searchStaffByName(search: string) {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: ["COUNSELLOR", "TEACHER", "ACCOUNTANT", "PARENT", "STUDENT"],
        },
      },
    });

    const results = [];

    for (const user of users) {
      const name = await CryptoUtil.decrypt(user.name); // 🔓

      if (name.toLowerCase().includes(search.toLowerCase())) {
        results.push({
          id: user.id,
          name,
          email: await CryptoUtil.decrypt(user.email),
          phone: await CryptoUtil.decrypt(user.phone),
          role: user.role,
          status: user.status,
        });
      }
    }

    return results;
  }
}
