// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load .env early to make sure PM2 sees it
dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Determine which URL to use
    const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;
    if (!dbUrl) {
      throw new Error(
        'No database URL found. Set DATABASE_URL (prisma://...) or DIRECT_DATABASE_URL (postgresql://...) in your .env',
      );
    }

    // Check if URL is Prisma Accelerate
    const isAccelerate = dbUrl.startsWith('prisma://');

    super({
      engine: {
        type: 'client',
        ...(isAccelerate
          ? { accelerateUrl: dbUrl } // Prisma Accelerate
          : { adapter: 'postgresql' }), // Direct Postgres
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
