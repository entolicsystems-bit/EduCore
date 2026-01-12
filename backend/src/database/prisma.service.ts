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
        type: 'client', // Prisma 7 default engine
        adapter: 'postgresql', // required for client engine
        // If using Prisma Cloud/Accelerate, you could use accelerateUrl instead
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma disconnected');
  }
}
