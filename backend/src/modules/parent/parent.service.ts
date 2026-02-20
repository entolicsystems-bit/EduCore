import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateParentDto } from 'src/dto/create-parent.dto';
import { UpdateParentDto } from 'src/dto/update-parent.dto';
//import { PrismaService } from 'src/prisma/prisma.service';
//import { CreateParentDto } from './dto/create-parent.dto';
//import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create Parent + Map Students
  async create(dto: CreateParentDto) {
    const { studentIds, ...parentData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const parent = await tx.parent.create({
        data: parentData,
      });

      if (studentIds?.length) {
        await tx.pARENT_STUDENT_MAP.createMany({
          data: studentIds.map((studentId) => ({
            parentId: parent.id,
            studentId,
          })),
        });
      }

      return parent;
    });
  }

  // ✅ Get All Parents
  async findAll() {
    return this.prisma.parent.findMany({
      where: { },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  // ✅ Get One Parent
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
      throw new NotFoundException('Parent not found');
    }

    return parent;
  }

  // ✅ Update Parent + Re-map Students
  async update(id: string, dto: UpdateParentDto) {
    const { studentIds, ...parentData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const parent = await tx.parent.update({
        where: { id },
        data: parentData,
      });

      if (studentIds) {
        await tx.pARENT_STUDENT_MAP.deleteMany({
          where: { parentId: id },
        });

        await tx.pARENT_STUDENT_MAP.createMany({
          data: studentIds.map((studentId) => ({
            parentId: id,
            studentId,
          })),
        });
      }

      return parent;
    });
  }

  // ✅ Delete Parent
  async remove(id: string) {
    return this.prisma.parent.delete({
      where: { id },
    });
  }

  // ✅ Get Students By Parent
  async getStudentsByParent(parentId: string) {
    return this.prisma.pARENT_STUDENT_MAP.findMany({
      where: { parentId },
      include: {
        student: true,
      },
    });
  }
}