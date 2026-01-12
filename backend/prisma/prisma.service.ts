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
      log: ['error', 'warn'], // only logs
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected ✅');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected ❌');
  }
}
