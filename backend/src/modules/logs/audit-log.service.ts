import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(
    tableName: string,
    action: string,
    oldValue?: any,
    newValue?: any,
    userId?: string
  ) {
    return this.prisma.auditLog.create({
      data: {
        tableName,
        action,
        oldValue,
        newValue,
        userId,
      },
    });
  }
}
