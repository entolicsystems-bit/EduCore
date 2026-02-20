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

  // ================= HELPER =================
  private toJson(value: any): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value));
  }

  // ================= CREATE =================
  async create(dto: CreateCourseDto) {
    try {

      // Validate duplicate subject codes
      if (dto.subjects?.length) {
        const codes = dto.subjects.map(s => s.code);
        if (new Set(codes).size !== codes.length) {
          throw new BadRequestException("Duplicate subject codes not allowed");
        }
      }

      return await this.prisma.course.create({
        data: {
          tenantId: dto.tenantId,
          name: dto.name,
          description: dto.description,
          duration: dto.duration,
          durationType: dto.durationType,
          status: dto.status,
          subjects: dto.subjects
            ? this.toJson(dto.subjects)
            : undefined,
        }
      });

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= GET ALL =================
  async getAll() {
    try {

      return await this.prisma.course.findMany({
        orderBy: { createdAt: "desc" }
      });

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= GET BY COURSE ID =================
  async getById(courseId: string) {
    try {

      const course = await this.prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        throw new NotFoundException("Course not found");
      }

      return course;

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= UPDATE BY COURSE ID =================
  async updateById(courseId: string, dto: UpdateCourseDto) {
    try {

      await this.getById(courseId);

      if (dto.subjects?.length) {
        const codes = dto.subjects.map(s => s.code);
        if (new Set(codes).size !== codes.length) {
          throw new BadRequestException("Duplicate subject codes not allowed");
        }
      }

      return await this.prisma.course.update({
        where: { id: courseId },
        data: {
          name: dto.name,
          description: dto.description,
          duration: dto.duration,
          durationType: dto.durationType,
          status: dto.status,
          subjects: dto.subjects
            ? this.toJson(dto.subjects)
            : undefined,
        }
      });

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= DELETE BY COURSE ID =================
  async deleteById(courseId: string) {
    try {

      await this.getById(courseId);

      await this.prisma.course.delete({
        where: { id: courseId }
      });

      return { message: "Course deleted successfully" };

    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ================= COMMON ERROR HANDLER =================
  private handlePrismaError(error: any): never {

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

    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    console.error("Unexpected Error:", error);
    throw new InternalServerErrorException("Something went wrong");
  }
}
