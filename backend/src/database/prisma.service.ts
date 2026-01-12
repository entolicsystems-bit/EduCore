import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NodeEngine } from '@prisma/client/runtime';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      engine: {
        type: 'client',
        adapter: NodeEngine, // ✅ Required for Prisma 5+ in Node
      },
    });
  }
}
