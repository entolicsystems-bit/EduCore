import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import { PrismaService } from "src/database/prisma.service";
import { AssignTeacherDto } from "src/dto/assignTeacher.dto";

@Injectable()
export class TeacherAssignmentService {
  constructor(private prisma: PrismaService) {}

  async assignTeacher(
    batchId: string,
    dto: AssignTeacherDto,
    currentUser: any,
  ) {
    const { teacherId, role } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Check batch exists
      const batch = await tx.batch.findUnique({
        where: { id: batchId },
      });

      if (!batch) {
        throw new NotFoundException("Batch not found");
      }

      // 2️⃣ Check staff exists (NOT user now)
      const teacher = await tx.staff.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw new NotFoundException("Teacher not found");
      }

      // 3️⃣ Validate role inside staff table
      if (teacher.role !== "TEACHER") {
        throw new BadRequestException("Staff is not a teacher");
      }

      // 4️⃣ Branch isolation
      if (teacher.branchId !== batch.branchId) {
        throw new BadRequestException(
          "Teacher and batch must belong to same branch",
        );
      }

      // 5️⃣ Prevent duplicate assignment
      const existing = await tx.teacherAssignment.findFirst({
        where: {
          teacherId,
          batchId,
        },
      });

      if (existing) {
        throw new BadRequestException(
          "Teacher already assigned to this batch",
        );
      }

      // 6️⃣ Only one PRIMARY per batch
      if (role === "PRIMARY") {
        const existingPrimary =
          await tx.teacherAssignment.findFirst({
            where: {
              batchId,
              role: "PRIMARY",
            },
          });

        if (existingPrimary) {
          throw new BadRequestException(
            "Primary teacher already assigned",
          );
        }
      }

      // 7️⃣ Create assignment
      const assignment =
        await tx.teacherAssignment.create({
          data: {
            teacherId,
            batchId,
            role,
            userId: currentUser?.id, // who assigned
          },
        });

      return assignment;
    });
  }
    async removeTeacher(
    batchId: string,
    teacherId: string,
    currentUser: any,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const assignment =
        await tx.teacherAssignment.findFirst({
          where: {
            teacherId,
            batchId,
          },
        });

      if (!assignment) {
        throw new NotFoundException(
          "Teacher not assigned to this batch",
        );
      }

      await tx.teacherAssignment.delete({
        where: { id: assignment.id },
      });

      return { message: "Teacher removed successfully" };
    });
  }

 async getBatchTeachers(batchId: string) {
  const batch = await this.prisma.batch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    throw new NotFoundException("Batch not found");
  }

  const teachers =
    await this.prisma.teacherAssignment.findMany({
      where: { batchId },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

  // 🔐 Decrypt fields properly
  return Promise.all(
    teachers.map(async (t) => {
      const [name, email, phone] = await Promise.all([
        CryptoUtil.decrypt(t.teacher.user?.name),
        CryptoUtil.decrypt(t.teacher.user?.email),
        CryptoUtil.decrypt(t.teacher.user?.phone),
      ]);

      return {
        id: t.id,
        role: t.role,
        teacher: {
          id: t.teacher.id,
          name,          // decrypted
          email,         // decrypted
          phone,         // decrypted
          department: t.teacher.department,
          status: t.teacher.status,
        },
      };
    }),
  );
}
}