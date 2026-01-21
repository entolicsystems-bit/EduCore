// import { BadRequestException, Injectable } from "@nestjs/common";
// import { PrismaService } from "../../database/prisma.service";
// import { RegisterDto } from "src/dto/register.dto";
// import * as bcrypt from "bcrypt";
// import { User } from "@prisma/client";
// import { CryptoUtil } from "src/common/crypto/crypto.util"; // 🔐 add this

// @Injectable()
// export class RolesService {
//   constructor(private prisma: PrismaService) {}
//   async assignRole(userId: string, roleId: number) {
//     try {
//       const exists = await this.prisma.userRole.findUnique({
//         where: {
//           userId_roleId: { userId, roleId },
//         },
//       });

//       if (exists) return exists; // Already assigned

//        await this.prisma.userRole.create({
//         data: { userId, roleId },
//       });

//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async registerStaff(dto: RegisterDto, reqUser: User) {
//     try {
//       const { email, name, phone, password } = dto;
//       const roleName = dto.role.toUpperCase();

//       const allowedRoles = [
//         "COUNSELLOR",
//         "TEACHER",
//         "ACCOUNTANT",
//         "PARENT",
//         "STUDENT",
//       ];
//       if (!allowedRoles.includes(roleName)) {
//         throw new BadRequestException("Invalid role");
//       }

//       // 🔐 Encrypt fields for DB comparison
//       const encryptedEmail = await CryptoUtil.encrypt(email);
//       const encryptedPhone = await CryptoUtil.encrypt(phone);

//       // 🔍 Check uniqueness on encrypted values
//       const [emailExists, phoneExists] = await Promise.all([
//         this.prisma.user.findUnique({ where: { email: encryptedEmail } }), // 🔐
//         this.prisma.user.findFirst({ where: { phone: encryptedPhone } }), // 🔐
//       ]);

//       if (emailExists) throw new BadRequestException("Email already exists");
//       if (phoneExists) throw new BadRequestException("PhoneNo already exists");

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const user = await this.prisma.user.create({
//         data: {
//           email: encryptedEmail, // 🔐
//           name: await CryptoUtil.encrypt(name), // 🔐
//           phone: encryptedPhone, // 🔐
//           role: roleName,
//           tenantId: reqUser.tenantId,
//           branchId: reqUser.branchId,
//           passwordHash: hashedPassword,
//         },
//       });

//       const roleMap = {
//         COUNSELLOR: 2,
//         TEACHER: 3,
//         ACCOUNTANT: 4,
//         PARENT: 5,
//         STUDENT: 6,
//       };

//       await this.assignRole(user.id, roleMap[roleName]);

//       const { passwordHash: _, ...safeUser } = user;

//       await this.prisma.auditLog.create({
//         data: {
//           tableName: "User",
//           action: "AssignRole",
//           oldValue: null,
//           newValue: user,
//           userId: reqUser.id,
//         },
//       });
//       return safeUser;
//     } catch (error) {
//       console.error("registerStaff failed:", error);
//       throw error;
//     }
//   }

//   async getAllStaff() {
//     const users = await this.prisma.user.findMany({
//       where: {
//         role: {
//           in: ["COUNSELLOR", "TEACHER", "ACCOUNTANT", "PARENT", "STUDENT"],
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return Promise.all(
//       users.map(async (u) => ({
//         id: u.id,
//         name: await CryptoUtil.decrypt(u.name), // 🔓
//         email: await CryptoUtil.decrypt(u.email), // 🔓
//         phone: await CryptoUtil.decrypt(u.phone), // 🔓
//         role: u.role,
//         status: u.status,
//         createdAt: u.createdAt,
//       }))
//     );
//   }

//   async searchStaffByName(search: string) {
//     const users = await this.prisma.user.findMany({
//       where: {
//         role: {
//           in: ["COUNSELLOR", "TEACHER", "ACCOUNTANT", "PARENT", "STUDENT"],
//         },
//       },
//     });

//     const results = [];

//     for (const user of users) {
//       const name = await CryptoUtil.decrypt(user.name); // 🔓

//       if (name.toLowerCase().includes(search.toLowerCase())) {
//         results.push({
//           id: user.id,
//           name,
//           email: await CryptoUtil.decrypt(user.email),
//           phone: await CryptoUtil.decrypt(user.phone),
//           role: user.role,
//           status: user.status,
//         });
//       }
//     }

//     return results;
//   }
// }

import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RegisterDto } from "src/dto/register.dto";
import * as bcrypt from "bcrypt";
import { CryptoUtil } from "src/common/crypto/crypto.util";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // ASSIGN SINGLE ROLE (RBAC TABLE)

  async assignRole(userId: string, roleId: number) {
    const exists = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: { userId, roleId },
      },
    });

    if (exists) return exists;

    return this.prisma.userRole.create({
      data: { userId, roleId },
    });
  }

  // ======================================================
  // ADD ROLE TO EXISTING USER (UPDATE, NOT CREATE)
  // ======================================================
  async addRoleToExistingUser(userId: string, newRole: string) {
    try {
      const allowedRoles = ["COUNSELLOR", "TEACHER", "ACCOUNTANT"];

      const role = newRole.toUpperCase();
      if (!allowedRoles.includes(role)) {
        throw new BadRequestException("Invalid role");
      }

      // 1️⃣ Fetch user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException("User not found");
      }

      // 2️⃣ Merge roles
      const existingRoles = user.role
        ? user.role.split(",").map((r) => r.trim())
        : [];

      if (!existingRoles.includes(role)) {
        existingRoles.push(role);
      }

      const updatedRoleString = existingRoles.join(", ");

      // 3️⃣ Update USER table (SINGLE ROW)
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { role: updatedRoleString },
      });

      // 4️⃣ Update RBAC table
      const roleMap = {
        COUNSELLOR: 2,
        TEACHER: 3,
        ACCOUNTANT: 4,
      };

      await this.assignRole(userId, roleMap[role]); // ✅ NOW EXISTS

      // 5️⃣ Return updated record
      return {
        id: updatedUser.id,
        name: await CryptoUtil.decrypt(updatedUser.name),
        email: await CryptoUtil.decrypt(updatedUser.email),
        phone: await CryptoUtil.decrypt(updatedUser.phone),
        role: updatedUser.role,
        status: updatedUser.status,
      };
    } catch (error) {
      console.log("error in updateRole:", error);
      throw error;
    }
  }

  // ======================================================
  // DUPLICATION CHECK (NO PRISMA CHANGE)
  // Decrypt + Compare ONLY during registration
  // ======================================================
  private async checkDuplicateUser(email: string, phone: string) {
    const users = await this.prisma.user.findMany({
      select: {
        email: true,
        phone: true,
      },
    });

    for (const user of users) {
      const dbEmail = await CryptoUtil.decrypt(user.email);
      const dbPhone = await CryptoUtil.decrypt(user.phone);

      if (dbEmail === email || dbPhone === phone) {
        throw new BadRequestException("User already exists");
      }
    }
  }

  // ======================================================
  // REGISTER STAFF
  // ======================================================
  async registerStaff(dto: RegisterDto, adminId: string) {
    try {
      /**
       * 🔐 PARAMETER ALLOWLIST
       */
      const allowed = ["email", "name", "phone", "password", "role"];
      for (const key of Object.keys(dto)) {
        if (!allowed.includes(key)) {
          throw new BadRequestException("Invalid input");
        }
      }

      const { email, name, phone, password } = dto;

      /**
       * 🔐 FETCH ADMIN (TENANT & BRANCH)
       */
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
        select: {
          role: true,
          tenantId: true,
          branchId: true,
        },
      });

      if (!admin || !admin.role.includes("ADMIN")) {
        throw new BadRequestException("Unauthorized");
      }

      /**
       * 🔐 ROLE NORMALIZATION
       */
      const roles = Array.isArray(dto.role)
        ? dto.role.map((r) => r.toUpperCase())
        : [dto.role.toUpperCase()];

      const allowedRoles = [
        "COUNSELLOR",
        "TEACHER",
        "ACCOUNTANT",
        "PARENT",
        "STUDENT",
      ];
      for (const role of roles) {
        if (!allowedRoles.includes(role)) {
          throw new BadRequestException("Invalid role");
        }
      }

      /**
       * 🔐 BASIC VALIDATION
       */
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new BadRequestException("Invalid email");
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        throw new BadRequestException("Invalid phone");
      }

      if (!password || password.length < 8) {
        throw new BadRequestException("Invalid password");
      }

      /**
       * ✅ DUPLICATION CHECK
       * (Decrypt + compare, NO schema change)
       */
      await this.checkDuplicateUser(email, phone);

      /**
       * 🔐 CREATE USER (ENCRYPTED STORAGE)
       */
      const user = await this.prisma.user.create({
        data: {
          email: await CryptoUtil.encrypt(email),
          phone: await CryptoUtil.encrypt(phone),
          name: await CryptoUtil.encrypt(name),
          passwordHash: await bcrypt.hash(password, 10),
          role: [...new Set(roles)].join(", "),
          tenantId: admin.tenantId,
          branchId: admin.branchId,
        },
      });

      /**
       * 🔐 ASSIGN PRIMARY ROLE (RBAC)
       */
      const roleMap = {
        COUNSELLOR: 2,
        TEACHER: 3,
        ACCOUNTANT: 4,
        PARENT: 5,
        STUDENT: 6,
      };

      await this.assignRole(user.id, roleMap[roles[0]]);

      /**
       * 🔓 RETURN SAFE RESPONSE
       */
      return {
        id: user.id,
        name: await CryptoUtil.decrypt(user.name),
        email: await CryptoUtil.decrypt(user.email),
        phone: await CryptoUtil.decrypt(user.phone),
        role: user.role,
        status: user.status,
        tenantId: user.tenantId,
        branchId: user.branchId,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("REGISTER STAFF ERROR:", error);
      throw error;
    }
  }

  // ======================================================
  // GET ALL STAFF
  // ======================================================
  async getAllStaff() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      users.map(async (u) => ({
        id: u.id,
        name: await CryptoUtil.decrypt(u.name),
        email: await CryptoUtil.decrypt(u.email),
        phone: await CryptoUtil.decrypt(u.phone),
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
    );
  }

  // ======================================================
  // SEARCH STAFF BY ID
  // ======================================================
  async searchStaffById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: await CryptoUtil.decrypt(user.name),
      email: await CryptoUtil.decrypt(user.email),
      phone: await CryptoUtil.decrypt(user.phone),
      role: user.role,
      status: user.status,
    };
  }

  // ======================================================
  // SEARCH STAFF BY NAME
  // ======================================================
  async searchStaffByName(search: string) {
    const users = await this.prisma.user.findMany();

    const results = [];
    for (const user of users) {
      const name = await CryptoUtil.decrypt(user.name);

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

  // ======================================================
  // ASSIGN / UPDATE MULTIPLE ROLES (OPTIONAL)
  // ======================================================
  async assignRolesToUser(userId: string, roles: string[]) {
    if (!Array.isArray(roles) || roles.length === 0) {
      throw new BadRequestException("Invalid role input");
    }

    const allowedRoles = [
      "COUNSELLOR",
      "TEACHER",
      "ACCOUNTANT",
      "PARENT",
      "STUDENT",
    ];

    const normalizedRoles = roles.map((r) => r.toUpperCase());

    for (const role of normalizedRoles) {
      if (!allowedRoles.includes(role)) {
        throw new BadRequestException("Invalid role");
      }
    }

    const uniqueRoles = [...new Set(normalizedRoles)];

    const roleMap = {
      COUNSELLOR: 2,
      TEACHER: 3,
      ACCOUNTANT: 4,
      PARENT: 5,
      STUDENT: 6,
    };

    for (const role of uniqueRoles) {
      await this.assignRole(userId, roleMap[role]);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: uniqueRoles.join(", ") },
    });

    return {
      message: "Roles assigned successfully",
      roles: user.role,
    };
  }
}
