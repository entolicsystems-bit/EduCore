import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateStudentCsvDto } from "src/dto/csv-import-dto";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import { hashValue } from "src/utils/hash.util";
import { userInfo } from "node:os";
import { User } from "@prisma/client";

@Injectable()
export class CsvService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkCreate(data: CreateStudentCsvDto[], user: User) {
    try {
      // 1️⃣ Fetch all existing encrypted emails & phones
      const existingLeads = await this.prisma.lead.findMany({
        select: {
          email: true,
          phone: true,
        },
      });

      // 2️⃣ Decrypt existing values into sets for duplicate checking
      const existingEmails = new Set<string>();
      const existingPhones = new Set<string>();

      for (const lead of existingLeads) {
        if (lead.email) {
          existingEmails.add(
            (await CryptoUtil.decrypt(lead.email)).trim().toLowerCase(),
          );
        }
        if (lead.phone) {
          existingPhones.add(
            (await CryptoUtil.decrypt(lead.phone)).replace(/\D/g, ""),
          );
        }
      }

      const skippedData: { student: CreateStudentCsvDto; reason: string }[] =
        [];
      const validData: CreateStudentCsvDto[] = [];

      // 3️⃣ Compare CSV data with decrypted values
      for (const student of data) {
        const normalizedEmail = student.email?.trim().toLowerCase();
        const normalizedPhone = student.phone.replace(/\D/g, "");

        if (normalizedEmail && existingEmails.has(normalizedEmail)) {
          skippedData.push({ student, reason: "Duplicate email" });
          continue;
        }

        if (existingPhones.has(normalizedPhone)) {
          skippedData.push({ student, reason: "Duplicate phone" });
          continue;
        }

        // Add to valid data
        validData.push(student);
        // Also add to sets to prevent duplicates within the CSV itself
        if (normalizedEmail) existingEmails.add(normalizedEmail);
        existingPhones.add(normalizedPhone);
      }

      const tenantId = user.tenantId;
      const branchId = user.branchId;

      // 4️⃣ Encrypt + hash before insert
      const usersToInsert = await Promise.all(
        validData.map(async (student) => {
          const normalizedEmail = student.email.trim().toLowerCase();
          const normalizedPhone = student.phone.replace(/\D/g, "");

          return {
            email: await CryptoUtil.encrypt(student.email),
            phone: await CryptoUtil.encrypt(student.phone),
            name: await CryptoUtil.encrypt(student.name),
            source: "CSV Import",
            status: "NEW",
            owner_id: user.id,
            tenantId: tenantId,
            branchId: branchId,
            emailHash: hashValue(normalizedEmail),
            phoneHash: hashValue(normalizedPhone),
          };
        }),
      );

      // 5️⃣ Insert into DB
      const result = await this.prisma.lead.createMany({
        data: usersToInsert,
        skipDuplicates: true, // DB-level uniqueness check
      });

      // 6️⃣ Audit log
      await this.prisma.auditLog.create({
        data: {
          tableName: "Lead",
          action: "CREATE",
          oldValue: null,
          newValue: `CSV Import (${result.count} leads)`,
          userId: user.id,
        },
      });

      // 7️⃣ Return summary
      return {
        insertedCount: result.count,
        skippedCount: skippedData.length,
        skippedData: skippedData.map((d) => d.student),
      };
    } catch (error) {
      console.error("CSV BULK CREATE ERROR 👉", error);
      throw new BadRequestException("Failed to import students");
    }
  }
}
