import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent(
    batchId: string,
    studentId: string,
    currentUser: any,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Check batch exists
      const batch = await tx.batch.findUnique({
        where: { id: batchId },
      });

      if (!batch) {
        throw new NotFoundException("Batch not found");
      }

      // 2️⃣ Check student exists
      const student = await tx.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException("Student not found");
      }

      // 3️⃣ Capacity validation
      const enrolledCount = await tx.enrollment.count({
        where: {
          batchId,
          deletedAt: null,
        },
      });

      if (enrolledCount >= batch.capacity) {
        throw new BadRequestException(
          "Batch capacity exceeded",
        );
      }

      // 4️⃣ Prevent duplicate enrollment
      const existing = await tx.enrollment.findFirst({
        where: {
          studentId,
          batchId,
          deletedAt: null,
        },
      });

      if (existing) {
        throw new BadRequestException(
          "Student already enrolled in this batch",
        );
      }

      // 5️⃣ Create enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          studentId,
          batchId,
          enrolledAt: currentUser?.id,
        },
      });

      // 6️⃣ Audit Log
      await tx.audit_Logs.create({
        data: {
          action: "STUDENT_ENROLLED",
          entityType: "BATCH",
          entityId: batchId,
          actorId: currentUser?.id,
          metadata: {
            studentId,
          },
        },
      });

      return enrollment;
    });
  }
}