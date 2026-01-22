import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateStudentCsvDto } from "src/dto/csv-import-dto";

@Injectable()
export class CsvService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkCreate(data: CreateStudentCsvDto[], userId: string) {
    try {
      // Find existing emails and phone numbers in bulk
      const existingStudents = await this.prisma.lead.findMany({
        where: {
          OR: [
            { email: { in: data.map((d) => d.email) } },
            { phone: { in: data.map((d) => d.phone) } },
          ],
        },
        select: { email: true, phone: true },
      });

      const existingEmails = new Set(existingStudents.map((s) => s.email));
      const existingPhones = new Set(existingStudents.map((s) => s.phone));

      const skippedData: { student: CreateStudentCsvDto; reason: string }[] =
        [];
      const newData = data.filter((d) => {
        if (existingEmails.has(d.email)) {
          skippedData.push({ student: d, reason: "Duplicate email" });
          return false;
        }
        if (existingPhones.has(d.phone)) {
          skippedData.push({ student: d, reason: "Duplicate phone" });
          return false;
        }
        return true;
      });

      // Prepare data for insertion
      const usersToInsert = newData.map((student) => ({
        email: student.email,
        name: student.name,
        phone: student.phone,
        source: "CSV Import",
        status: "NEW",
        owner_id: userId,
      }));

      const result = await this.prisma.lead.createMany({
        data: usersToInsert,
        skipDuplicates: true,
      });

      await this.prisma.auditLog.create({
        data: {
          tableName: "Lead",
          action: "CREATE",
          oldValue: null,
          newValue: `CSV Import (${usersToInsert.length} leads)`,
          userId: userId,
        },
      });
      return {
        insertedCount: result.count,
        skippedCount: skippedData.length,
        skippedData: skippedData.map((d) => d.student),
      };
    } catch (error) {
      throw new BadRequestException("Failed to import students", error);
    }
  }
}
