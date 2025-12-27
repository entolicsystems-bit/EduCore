// import { PrismaClient } from "@prisma/client";

// export async function seedRolesAndPermissions(prisma: PrismaClient) {
//   const roles = ["ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT"];

//   for (const name of roles) {
//     await prisma.role.upsert({
//       where: { name },
//       update: {},
//       create: { name },
//     });
//   }

//   console.log("✅ Roles seeded");

//   const permissions = [
//     { module: "user", action: "create" },
//     { module: "user", action: "read" },
//     { module: "user", action: "update" },
//     { module: "user", action: "delete" },
//     { module: "student", action: "create" },
//     { module: "student", action: "read" },
//     { module: "student", action: "update" },
//     { module: "student", action: "delete" },
//   ];

//   for (const permission of permissions) {
//     await prisma.permission.upsert({
//       where: {
//         module_action: {
//           module: permission.module,
//           action: permission.action,
//         },
//       },
//       update: {},
//       create: permission,
//     });
//   }

//   console.log("✅ Permissions seeded");
// }
