import { RolesService } from './../roles/roles.service';
import { CreateStaffDto } from './../../dto/staff-register.dto';
import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import * as bcrypt from "bcrypt";
import { StaffStatus } from "@prisma/client";

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
  ) {}

  // ======================================================
  // CREATE STAFF
  // ======================================================
  async createStaff(dto: CreateStaffDto, adminId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.role.includes("ADMIN")) {
      throw new BadRequestException("Unauthorized");
    }

    const role = dto.role.toUpperCase();

    const allowedRoles = ["TEACHER", "COUNSELLOR", "ACCOUNTANT"];
    if (!allowedRoles.includes(role)) {
      throw new BadRequestException("Invalid staff role");
    }

    // Duplicate Check
    const users = await this.prisma.user.findMany({
      select: { email: true, phone: true },
    });

    for (const u of users) {
      if (
        (await CryptoUtil.decrypt(u.email)) === dto.email ||
        (await CryptoUtil.decrypt(u.phone)) === dto.phone
      ) {
        throw new BadRequestException("User already exists");
      }
    }

    // Create User
    const tempPassword = Math.random().toString(36).slice(-8);

    const user = await this.prisma.user.create({
      data: {
        email: await CryptoUtil.encrypt(dto.email),
        phone: await CryptoUtil.encrypt(dto.phone),
        name: await CryptoUtil.encrypt(dto.name),
        passwordHash: await bcrypt.hash(tempPassword, 10),
        role: role,
        tenantId: admin.tenantId,
        branchId: admin.branchId,
      },
    });

    // Assign RBAC
    const roleMap = {
      TEACHER: 3,
      COUNSELLOR: 2,
      ACCOUNTANT: 4,
    };

    await this.rolesService.assignRole(user.id, roleMap[role]);

    // Create Staff Profile
    const staff = await this.prisma.staff.create({
      data: {
        tenantId: admin.tenantId,
        branchId: admin.branchId,
        userId: user.id,
        name: dto.name,
        role: role,
        department: dto.department ?? null,
        status: dto.status ?? StaffStatus.ACTIVE,
      },
    });

    return {
      staff,
    };
  }

  // ======================================================
  // GET STAFF LIST
  // ======================================================
 async getStaffList(query: any, adminId: string) {
  const admin = await this.prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    throw new BadRequestException("Admin not found");
  }

  const { role, status, page = 1, limit = 10 } = query;

  const staffList = await this.prisma.staff.findMany({
    where: {
      tenantId: admin.tenantId,
      branchId: admin.branchId,
       deletedAt: null, 
      ...(role && { role }),
      ...(status && { status }),
    },
    include: { user: true },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { createdAt: "desc" },
  });

  // 🔓 Decrypt user fields
  return Promise.all(
    staffList.map(async (staff) => ({
      id: staff.id,
      name: staff.name, // staff table → plain
      role: staff.role,
      department: staff.department,
      status: staff.status,
      createdAt: staff.createdAt,

      // 🔐 Decrypted from user table
      email: await CryptoUtil.decrypt(staff.user.email),
      phone: await CryptoUtil.decrypt(staff.user.phone),
    }))
  );
}
  // ======================================================
  // ACTIVATE / DEACTIVATE
  // ======================================================
  async updateStatus(
    id: string,
    status: StaffStatus,
    adminId: string,
  ) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.role.includes("ADMIN")) {
      throw new BadRequestException("Unauthorized");
    }

    return this.prisma.staff.update({
      where: { id },
      data: { status },
    });
  }

  async softDeleteStaff(id: string, adminId: string) {
  const admin = await this.prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin || !admin.role.includes("ADMIN")) {
    throw new BadRequestException("Unauthorized");
  }

  return this.prisma.staff.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: "INACTIVE", // optional but recommended
    },
  });
}
}