// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super(); // No datasources here, Prisma 7 reads DATABASE_URL from .env
  }

  // Connect when module initializes
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected');
  }

  // Disconnect when module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma disconnected');
  }

  // Optional: helper to clear DB in tests
  async cleanDatabase() {
    const modelNames = Object.keys(this).filter(
      (key) => this[key]?.deleteMany instanceof Function,
    );
    for (const modelName of modelNames) {
      await this[modelName].deleteMany({});
    }
  }
}
