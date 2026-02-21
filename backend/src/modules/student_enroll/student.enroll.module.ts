import { EnrollmentController } from './student.enroll.controller';
import { EnrollmentService } from './student.enroll.service';
import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [EnrollmentService, PrismaService],
  controllers: [EnrollmentController],
})
export class StudentEnrollModule {}
