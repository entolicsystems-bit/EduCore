import "dotenv/config";
import { CryptoUtil } from "../src/common/crypto/crypto.util";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL, // ✅ works for Prisma Accelerate
});

async function seedAdmin() {
  console.log("CRYPTO_SECRET from seed:", process.env.CRYPTO_SECRET);

  const encryptedEmail = await CryptoUtil.encrypt("admin@erp.com"); // 🔐
  const encryptedPhone = await CryptoUtil.encrypt("9999999999"); // 🔐

  const exists = await prisma.user.findUnique({
    where: { email: encryptedEmail },
  });

  if (exists) {
    console.log("ℹ️ Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      email: encryptedEmail,
      name: await CryptoUtil.encrypt("System Admin"), // 🔐
      phone: encryptedPhone,
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log("✅ Admin encrypted and seeded successfully");
}

async function seedRolesAndPermissions() {
  const roles = [
    "ADMIN",
    "COUNSELLOR",
    "TEACHER",
    "ACCOUNTANT",
    "PARENT",
    "STUDENT",
  ];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Roles seeded");

  const permissions = [
    { module: "user", action: "create" },
    { module: "user", action: "read" },
    { module: "user", action: "update" },
    { module: "user", action: "delete" },
    { module: "student", action: "create" },
    { module: "student", action: "read" },
    { module: "student", action: "update" },
    { module: "student", action: "delete" },
    { module: "parent", action: "create" },
    { module: "parent", action: "read" },
    { module: "parent", action: "update" },
    { module: "parent", action: "delete" },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        module_action: {
          module: permission.module,
          action: permission.action,
        },
      },
      update: {},
      create: permission,
    });
  }
  console.log("✅ Permissions seeded");

  // Role → Permission mapping
  const rolePermissions = {
    ADMIN: [
      "user:create",
      "user:read",
      "user:update",
      "user:delete",
      "student:create",
      "student:read",
      "student:update",
      "student:delete",
      "parent:create",
      "parent:read",
      "parent:update",
      "parent:delete",
    ],
    COUNSELLOR: ["student:read", "student:update", "parent:read"],
    TEACHER: ["student:read", "student:update", "student:create"],
    ACCOUNTANT: ["student:read"],
    PARENT: ["student:read", "parent:read"],
    STUDENT: ["student:read"],
  };

  const rolesFromDb = await prisma.role.findMany();
  const permissionsFromDb = await prisma.permission.findMany();

  const roleMap = new Map(rolesFromDb.map((r) => [r.name, r.id]));
  const permissionMap = new Map(
    permissionsFromDb.map((p) => [`${p.module}:${p.action}`, p.id]),
  );

  for (const [roleName, perms] of Object.entries(rolePermissions)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;

    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    await prisma.rolePermission.createMany({
      data: perms.map((perm) => ({
        roleId,
        permissionId: permissionMap.get(perm)!,
      })),
      skipDuplicates: true,
    });
  }

  console.log("✅ Role permissions assigned");
}

async function main() {
  console.log("🌱 Seeding started...\n");

  await seedAdmin();
  await seedRolesAndPermissions();

  console.log("\n🌱 Seeding finished");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
