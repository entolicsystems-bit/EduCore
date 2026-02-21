import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
  exports: [CourseService] // optional (if other modules need it)
})
export class CourseModule {}
