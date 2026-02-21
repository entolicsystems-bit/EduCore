import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import { CreateParentDto } from "src/dto/create-parent.dto";
import { UpdateParentDto } from "src/dto/update-parent.dto";

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}

  /* =========================================================
     🔐 PRIVATE HELPERS
  ========================================================= */

  private async encryptField(value: string | null | undefined) {
    if (value === undefined) return undefined;
    if (!value) return null;
    return CryptoUtil.encrypt(value);
  }

  private async decryptField(value: string | null) {
    if (!value) return null;
    return CryptoUtil.decrypt(value);
  }

  private async decryptParent(parent: any) {
    return {
      ...parent,
      name: await this.decryptField(parent.name),
      email: await this.decryptField(parent.email),
      phone: await this.decryptField(parent.phone),
    };
  }

  private async decryptStudent(student: any) {
    return {
      ...student,
      name: await this.decryptField(student.name),
      email: await this.decryptField(student.email),
      phone: await this.decryptField(student.phone),
    };
  }

  /* =========================================================
     ✅ CREATE PARENT + MAP STUDENTS
  ========================================================= */

  async create(dto: CreateParentDto, user: any) {
    const { studentIds = [], ...parentData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const parent = await tx.parent.create({
        data: {
          branchId: parentData.branchId,
          relationship: parentData.relationship,
          userId: user.id,
          tenantId: user.tenantId,

          name: await this.encryptField(parentData.name),
          email: await this.encryptField(parentData.email),
          phone: await this.encryptField(parentData.phone),
        },
      });

      if (studentIds.length > 0) {
        const students = await tx.student.findMany({
          where: { id: { in: studentIds } },
          select: { id: true },
        });

        if (students.length !== studentIds.length) {
          throw new Error("One or more students not found");
        }

        await tx.pARENT_STUDENT_MAP.createMany({
          data: studentIds.map((studentId) => ({
            parentId: parent.id,
            studentId,
          })),
          skipDuplicates: true,
        });
      }

      return this.decryptParent(parent);
    });
  }

  /* =========================================================
     ✅ FIND ALL PARENTS
  ========================================================= */

  async findAll() {
    const parents = await this.prisma.parent.findMany({
      include: {
        students: {
          include: { student: true },
        },
      },
    });

    return Promise.all(
      parents.map(async (parent) => ({
        ...(await this.decryptParent(parent)),
        students: await Promise.all(
          parent.students.map(async (map) => ({
            ...map,
            student: await this.decryptStudent(map.student),
          }))
        ),
      }))
    );
  }

  /* =========================================================
     ✅ FIND ONE PARENT
  ========================================================= */

  async findOne(id: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: {
        students: {
          include: { student: true },
        },
      },
    });

    if (!parent) {
      throw new NotFoundException("Parent not found");
    }

    return {
      ...(await this.decryptParent(parent)),
      students: await Promise.all(
        parent.students.map(async (map) => ({
          ...map,
          student: await this.decryptStudent(map.student),
        }))
      ),
    };
  }

  /* =========================================================
     ✅ UPDATE PARENT + REMAP STUDENTS
  ========================================================= */

  async update(id: string, dto: UpdateParentDto) {
    const { studentIds, ...parentData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const encryptedData: any = {};

      if (parentData.branchId !== undefined)
        encryptedData.branchId = parentData.branchId;

      if (parentData.relationship !== undefined)
        encryptedData.relationship = parentData.relationship;

      if (parentData.name !== undefined)
        encryptedData.name = await this.encryptField(parentData.name);

      if (parentData.email !== undefined)
        encryptedData.email = await this.encryptField(parentData.email);

      if (parentData.phone !== undefined)
        encryptedData.phone = await this.encryptField(parentData.phone);

      const parent = await tx.parent.update({
        where: { id },
        data: encryptedData,
      });

      if (studentIds !== undefined) {
        await tx.pARENT_STUDENT_MAP.deleteMany({
          where: { parentId: id },
        });

        if (studentIds.length > 0) {
          await tx.pARENT_STUDENT_MAP.createMany({
            data: studentIds.map((studentId) => ({
              parentId: id,
              studentId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return this.decryptParent(parent);
    });
  }

  /* =========================================================
     ✅ DELETE PARENT
  ========================================================= */

  async remove(id: string) {
    return this.prisma.parent.delete({
      where: { id },
    });
  }

  /* =========================================================
     ✅ GET STUDENTS BY PARENT
  ========================================================= */

  async getStudentsByParent(parentId: string) {
    const mappings = await this.prisma.pARENT_STUDENT_MAP.findMany({
      where: { parentId },
      include: { student: true },
    });

    return Promise.all(
      mappings.map(async (map) => ({
        ...map,
        student: await this.decryptStudent(map.student),
      }))
    );
  }
}