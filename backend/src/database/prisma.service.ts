// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      engine: {
        type: 'client',
        accelerateUrl: process.env.DATABASE_URL, // Use prisma:// URL here
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected via Accelerate');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma disconnected');
  }
}
