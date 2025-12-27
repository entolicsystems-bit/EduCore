import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStudentCsvDto } from 'src/dto/csv-import-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CsvService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkCreate(data: CreateStudentCsvDto[]) {
    try {
      
      const existingStudents = await this.prisma.user.findMany({
        where: {
          email: {
            in: data.map((d) => d.email),
          },
        },
        select: { email: true },
      });

      const existingEmails = new Set(existingStudents.map((s) => s.email));


      const skippedData = data.filter((d) => existingEmails.has(d.email));
      const newData = data.filter((d) => !existingEmails.has(d.email));

    
      const usersToInsert = await Promise.all(
        newData.map(async (student) => ({
          email: student.email,
          name: student.name,
          phone: student.phone,
          role: student.role,
          passwordHash: await bcrypt.hash(student.password, 10),
        })),
      );

      
      const result = await this.prisma.user.createMany({
        data: usersToInsert,
      });

      return {
        insertedCount: result.count,
        skippedCount: skippedData.length,
        skippedData,
      };
    } catch (error) {
      console.error('CSV import error:', error);
      throw new BadRequestException('Failed to import students');
    }
  }
}
