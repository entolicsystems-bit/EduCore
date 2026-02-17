import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateCourseDto } from "src/dto/create-course.dto";
import { UpdateCourseDto } from "src/dto/update-course.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class CourseService {

  constructor(private prisma: PrismaService) {}

  // ================= CREATE =================
  async create(dto: CreateCourseDto) {
    try {

      const codes = dto.subjects.map(s => s.code);
      if (new Set(codes).size !== codes.length) {
        throw new BadRequestException("Duplicate subject codes not allowed");
      }

      const course = await this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description,
          duration: dto.duration,
          subjects: dto.subjects as unknown as Prisma.InputJsonValue,
          branch_id: dto.branch_id,
          tenant_id: dto.tenant_id
        }
      });

      await this.prisma.audit_Logs.create({
        data: {
          action: "CREATE",
          entityType: "COURSE",
          entityId: course.id,
          metadata: dto as unknown as Prisma.InputJsonValue
        }
      });

      return course;

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= GET ALL =================
  async findAll(tenantId: string) {
    try {

      return await this.prisma.course.findMany({
        where: { tenant_id: tenantId },
        orderBy: { created_at: "desc" }
      });

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= GET BY ID =================
  async findOne(id: string) {
    try {

      const course = await this.prisma.course.findUnique({
        where: { id }
      });

      if (!course) {
        throw new NotFoundException("Course not found");
      }

      return course;

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= UPDATE =================
  async update(id: string, dto: UpdateCourseDto) {
    try {

      await this.findOne(id);

      if (dto.subjects) {
        const codes = dto.subjects.map(s => s.code);
        if (new Set(codes).size !== codes.length) {
          throw new BadRequestException("Duplicate subject codes not allowed");
        }
      }

      const updated = await this.prisma.course.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          duration: dto.duration,
          subjects: dto.subjects
            ? dto.subjects as unknown as Prisma.InputJsonValue
            : undefined,
          branch_id: dto.branch_id,
          tenant_id: dto.tenant_id
        }
      });

      await this.prisma.audit_Logs.create({
        data: {
          action: "UPDATE",
          entityType: "COURSE",
          entityId: id,
          metadata: dto as unknown as Prisma.InputJsonValue
        }
      });

      return updated;

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= DELETE =================
  async delete(id: string) {
    try {

      await this.findOne(id);

      await this.prisma.course.delete({
        where: { id }
      });

      await this.prisma.audit_Logs.create({
        data: {
          action: "DELETE",
          entityType: "COURSE",
          entityId: id
        }
      });

      return { message: "Course deleted successfully" };

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= COMMON ERROR HANDLER =================
  private handlePrismaError(error: any): never {

    // Prisma Known Errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {

      switch (error.code) {

        case "P2002":
          throw new BadRequestException("Duplicate value violates unique constraint");

        case "P2025":
          throw new NotFoundException("Record not found");

        default:
          throw new BadRequestException(error.message);
      }
    }

    // Already Nest Exception
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    // Unknown Error
    console.error("Unexpected Error:", error);
    throw new InternalServerErrorException("Something went wrong");
  }

  

}
