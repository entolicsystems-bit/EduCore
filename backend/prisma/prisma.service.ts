// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as config from 'config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'), // dynamically set database URL
        },
      },
      log: ['error', 'warn', 'query'], // optional: include 'query' for debugging
    });
  }

  // Connect when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Disconnect gracefully when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
