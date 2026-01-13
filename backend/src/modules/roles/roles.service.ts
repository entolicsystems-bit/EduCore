import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RegisterDto } from "src/dto/register.dto";
import * as bcrypt from "bcrypt";
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

 async registerStaff(dto: RegisterDto, adminId: string) {
  try {
    /**
     * 🔐 PARAMETER ALLOWLIST
     * -----------------------------------------------
     * Prevents attackers from injecting extra fields
     */
    const allowed = ["email", "name", "phone", "password", "role"];
    for (const key of Object.keys(dto)) {
      if (!allowed.includes(key)) {
        throw new BadRequestException("Invalid input");
      }
    }

    const { email, name, phone, password } = dto;
    const roleName = dto.role.toUpperCase();

    /**
     * 🔐 ROLE VALIDATION
     */
    const allowedRoles = ["COUNSELLOR", "TEACHER", "ACCOUNTANT"];
    if (!allowedRoles.includes(roleName)) {
      throw new BadRequestException("Invalid role");
    }

    /**
     * 🔐 BASIC FORMAT VALIDATION
     */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException("Invalid input");
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      throw new BadRequestException("Invalid input");
    }

    if (!password || password.length < 8) {
      throw new BadRequestException("Invalid input");
    }

    // 🔐 Encrypt for DB storage & comparison
    const encryptedEmail = await CryptoUtil.encrypt(email);
    const encryptedPhone = await CryptoUtil.encrypt(phone);

    // 🔍 Uniqueness check on encrypted values
    const [emailExists, phoneExists] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: encryptedEmail } }),
      this.prisma.user.findFirst({ where: { phone: encryptedPhone } }),
    ]);

    /**
     * 🔐 Prevent account enumeration
     * Do NOT reveal which field exists
     */
    if (emailExists || phoneExists) {
      throw new BadRequestException("Unable to process the request");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: encryptedEmail,
        name: await CryptoUtil.encrypt(name),
        phone: encryptedPhone,
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
    /**
     * 🔐 ERROR DISCLOSURE PROTECTION
     * -----------------------------------------------
     * Never expose database, Prisma, or stack traces
     * to the client. Log internally only.
     */
    console.error("REGISTER STAFF ERROR:", error);
    throw new BadRequestException("Unable to process the request");
  }
}


  async getAllStaff() {
  const users = await this.prisma.user.findMany({
    where: {
      role: { in: ["COUNSELLOR", "TEACHER", "ACCOUNTANT", "PARENT", "STUDENT"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    users.map(async (u) => ({
      id: u.id,
      name: await CryptoUtil.decrypt(u.name),      // 🔓
      email: await CryptoUtil.decrypt(u.email),    // 🔓
      phone: await CryptoUtil.decrypt(u.phone),    // 🔓
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }))
  );
}

async searchStaffByName(search: string) {
  const users = await this.prisma.user.findMany({
    where: {
      role: { in: ["COUNSELLOR", "TEACHER", "ACCOUNTANT", "PARENT", "STUDENT"] },
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
