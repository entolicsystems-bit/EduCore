// import * as bcrypt from 'bcrypt';
// import { PrismaClient } from '@prisma/client';

// export async function seedAdmin(prisma: PrismaClient) {
//   const exists = await prisma.user.findUnique({
//     where: { email: 'admin@erp.com' },
//   });

//   if (exists) {
//     console.log('ℹ️ Admin already exists');
//     return;
//   }

//   const passwordHash = await bcrypt.hash('Admin@123', 10);

//   await prisma.user.create({
//     data: {
//       email: 'admin@erp.com',
//       name: 'System Admin',
//       phone: '9999999999',
//       role: 'ADMIN',
//       passwordHash,
//     },
//   });

//   console.log('✅ Admin seeded successfully');
// }
