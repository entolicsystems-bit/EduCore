import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBatchDto } from 'src/dto/create-batch.dto';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async createBatch(dto: CreateBatchDto) {
    try {
      // 1. Verify Course exists
      const course = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });
      
      if (!course) {
        throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
      }

    return await this.prisma.batch.create({
        data: {
          name: dto.name,
          capacity: dto.capacity,
          start_date: new Date(dto.startDate),
          end_date: new Date(dto.endDate),
          course_id: dto.courseId,
          branch_id: dto.branchId,
          tenant_id: dto.tenantId,
          timetable: dto.timetable ?? {},
          status: 'ACTIVE',
        },
        include: { course: true },
      });
    } catch (error) {
      // 🟢 Catching specific Prisma errors (e.g., Foreign Key failures)
      if (error.code === 'P2003') {
        throw new BadRequestException(`Foreign key constraint failed: check if courseId or branchId exists.`);
      }
      
      // Log the full error in your terminal so you can see the real cause
      console.error("Prisma Error:", error);
      
      throw new BadRequestException(
        error.message || 'Database error occurred while creating batch'
      );
    }
  }

  async findAll() {
    return this.prisma.batch.findMany({
      include: {
        course: { select: { title: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getBatchDetails(id: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        course: true,
        enrollments: true,
      },
    });

    if (!batch) throw new NotFoundException(`Batch with ID ${id} not found`);
    return batch;
  }

  async removeBatch(id: string) {
    await this.getBatchDetails(id); // Ensure it exists first

    return this.prisma.batch.delete({
      where: { id },
    });
  }
}