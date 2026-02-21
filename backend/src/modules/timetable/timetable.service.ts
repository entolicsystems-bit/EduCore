import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { isUUID, validate } from "class-validator";
import { PrismaService } from "src/database/prisma.service";
import { TimetableSlot, UpdateTimetable } from "src/dto/updateTimetable.dto";

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  //create timetable for batch
  async updateTimetable(batchId: string, dto: UpdateTimetable, reqUser: User) {
    try {
      //Validate UUID
      if (!isUUID(batchId)) {
        throw new BadRequestException("Invalid UUID format");
      }

      //Fetch batch with tenant isolation
      const batch = await this.prisma.batch.findFirst({
        where: {
          id: batchId,
          tenantId: reqUser.tenantId,
        },
        include: {
          course: true,
        },
      });

      //if batch not found
      if (!batch) {
        throw new NotFoundException("Batch not found");
      }

      //Branch-level authorization
      if (batch.branchId !== reqUser.branchId) {
        throw new ForbiddenException(
          "You are not allowed to modify this batch",
        );
      }

      //Validate subjects from course
      const allowedSubjects =
        (
          batch.course?.subjects as {
            code: string;
            name: string;
            credits: number;
          }[]
        )?.map((subject) => subject.name) || [];

      if (!allowedSubjects.length) {
        throw new BadRequestException("No subjects defined for this course");
      }

      //Validate timetable structure
      const allowedDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      for (const day in dto.timetable) {
        if (!allowedDays.includes(day.toLowerCase())) {
          throw new BadRequestException(`Invalid day: ${day}`);
        }

        const slots = dto.timetable[day];

        if (!Array.isArray(slots)) {
          throw new BadRequestException(`${day} must be an array`);
        }

        for (const slot of slots) {
          const slotInstance = plainToInstance(TimetableSlot, slot);
          const errors = await validate(slotInstance);

          if (errors.length > 0) {
            throw new BadRequestException(errors);
          }

          if (!allowedSubjects.includes(slot.subject)) {
            throw new BadRequestException(
              `Subject "${slot.subject}" is not part of this course`,
            );
          }
        }
      }

      //Store JSON safely
      const timetableJson: Prisma.InputJsonValue = JSON.parse(
        JSON.stringify(dto.timetable),
      );

      //Transaction
      await this.prisma.$transaction(async (tx) => {
        const existing = await tx.timetable.findUnique({
          where: { batchId },
        });

        const action = existing ? "TIMETABLE_UPDATED" : "TIMETABLE_CREATED";

        if (existing) {
          await tx.timetable.update({
            where: { batchId },
            data: {
              timetableJson,
              updatedAt: new Date(),
            },
          });
        } else {
          await tx.timetable.create({
            data: {
              batchId,
              timetableJson,
            },
          });
        }

        //Audit Log
        await tx.audit_Logs.create({
          data: {
            action,
            entityType: "BATCH",
            entityId: batchId,
            actorId: reqUser.id,
            metadata: {
              message: action,
              timetable: timetableJson,
            },
          },
        });
      });

      //Return response
      return {
        success: true,
        batchId,
        schedule: dto.timetable,
      };
    } catch (error) {
      console.error("Update Timetable Error:", error);
      throw error;
    }
  }

  //get timetable of batch
  async getTimetable(batchId: string) {
    //invalid uuid
    if (!isUUID(batchId)) {
      throw new BadRequestException("Invalid UUID format");
    }

    const timetable = await this.prisma.timetable.findUnique({
      where: { batchId },
    });

    if (!timetable) {
      return { schedule: null };
    }

    return {
      schedule: timetable.timetableJson,
    };
  }
}
