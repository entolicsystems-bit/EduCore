// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load .env immediately (important for PM2)
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Pick the URL
    const accelerateUrl = process.env.DATABASE_URL;       // prisma://
    const directUrl = process.env.DIRECT_DATABASE_URL;   // postgresql://

    if (!accelerateUrl && !directUrl) {
      throw new Error(
        'No database URL found. Set DATABASE_URL (prisma://) or DIRECT_DATABASE_URL (postgresql://) in your .env',
      );
    }

    // Decide which engine option to use
    const engineOptions = accelerateUrl && accelerateUrl.startsWith('prisma://')
      ? { accelerateUrl }          // Use Prisma Accelerate
      : { adapter: 'postgresql' }; // Use direct Postgres

    super({
      engine: {
        type: 'client',
        ...engineOptions,
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
