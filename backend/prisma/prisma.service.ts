import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import * as config from 'config'; 

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: config.get<string>("DATABASE_URL"), 
        },
      },
      log: ['error', 'warn','query'],
    });
  }
}
