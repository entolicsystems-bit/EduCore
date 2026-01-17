import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateStudentCsvDto } from "src/dto/csv-import-dto";
import { CryptoUtil } from "src/common/crypto/crypto.util";

@Injectable()
export class CsvService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkCreate(data: CreateStudentCsvDto[], userId: string) {
    try {
      // 1️⃣ Fetch all existing encrypted emails & phones
      const existingLeads = await this.prisma.lead.findMany({
        select: {
          email: true,
          phone: true,
        },
      });

      // 2️⃣ Decrypt existing values into sets
      const existingEmails = new Set<string>();
      const existingPhones = new Set<string>();

      for (const lead of existingLeads) {
        if (lead.email) {
          existingEmails.add(await CryptoUtil.decrypt(lead.email));
        }
        if (lead.phone) {
          existingPhones.add(await CryptoUtil.decrypt(lead.phone));
        }
      }

      const skippedData: { student: CreateStudentCsvDto; reason: string }[] =
        [];
      const validData: CreateStudentCsvDto[] = [];

      // 3️⃣ Compare CSV data with decrypted values
      for (const student of data) {
        if (existingEmails.has(student.email)) {
          skippedData.push({ student, reason: "Duplicate email" });
          continue;
        }

        if (existingPhones.has(student.phone)) {
          skippedData.push({ student, reason: "Duplicate phone" });
          continue;
        }

        validData.push(student);
      }

      // 4️⃣ Encrypt before insert
      const usersToInsert = await Promise.all(
        validData.map(async (student) => ({
          email: await CryptoUtil.encrypt(student.email),
          phone: await CryptoUtil.encrypt(student.phone),
          name: await CryptoUtil.encrypt(student.name),
          source: "CSV Import",
          status: "NEW",
          owner_id: userId,
        })),
      );

      const result = await this.prisma.lead.createMany({
        data: usersToInsert,
        skipDuplicates: true,
      });

      await this.prisma.auditLog.create({
        data: {
          tableName: "Lead",
          action: "CREATE",
          oldValue: null,
          newValue: `CSV Import (${result.count} leads)`,
          userId,
        },
      });

      return {
        insertedCount: result.count,
        skippedCount: skippedData.length,
        skippedData: skippedData.map((d) => d.student),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Failed to import students");
    }
  }
}
