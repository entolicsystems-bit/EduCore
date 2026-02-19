interface StudentProfileData {
  roll_number?: string;
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  academic?: {
    programId?: string;
  };
  enrolled_at?: Date;
}

interface AllProfileData {
  id?: string;
  roll_number?: string;
  enrolled_at?: string;
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  academic?: {
    programId?: string;
  };
}

import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ApplicationStatus, Prisma, User } from "@prisma/client";
import { DocumentStatus } from "src/dto/verify-document.dto";
import { application } from "express";
import { publicDecrypt } from "node:crypto";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import { isUUID, validate } from "class-validator";
import { studentProfileUpdateDto } from "src/dto/studentupdate.dto";
import { TimetableSlot, UpdateTimetable } from "src/dto/updateTimetable.dto";
import { plainToInstance } from "class-transformer";
import { identity } from "rxjs";

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async convertLead(applicationId: string, user: any) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // find application
        const application = await tx.application.findUnique({
          where: { id: applicationId },
          include: {
            admissionDocuments: true,
            lead: true,
          },
        });

        if (!application) {
          throw new BadRequestException("Application not found");
        }

        if (application.status !== ApplicationStatus.DOCUMENT_VERIFIED) {
          throw new BadRequestException(
            "Only VERIFIED applications can be converted",
          );
        }

        const existingStudent = await tx.student.findUnique({
          where: { application_id: application.id },
        });

        if (existingStudent) {
          throw new BadRequestException(
            "Application already converted to student",
          );
        }

        const unverifiedDocs = application.admissionDocuments.filter(
          (d) => d.status !== DocumentStatus.VERIFIED,
        );

        if (unverifiedDocs.length > 0) {
          throw new BadRequestException(
            "All required documents must be verified",
          );
        }

        const rollNumber = `STU-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`;

        const student = await tx.student.create({
          data: {
            application_id: applicationId,
            created_by: application.reviewedBy ?? user.id,
            tenant_id: application.tenantId,
            branch_id: application.branchId,
            status: "ENROLLED",
            profile_data: {
              roll_number: rollNumber,
              personal: {
                name: application.lead?.name,
                email: application.lead?.email,
                phone: application.lead?.phone,
              },
              academic: {
                programId: application.programId,
              },
              enrolled_at: new Date(),
            },
          },
        });

        await tx.application.update({
          where: { id: application.id },
          data: {
            status: ApplicationStatus.ENROLLED,
            updatedAt: new Date(),
          },
        });

        await tx.lead.update({
          where: { id: application.leadId },
          data: {
            status: "CONVERTED",
          },
        });

        await tx.activityTimeline.createMany({
          data: [
            {
              entityType: "APPLICATION",
              entityId: application.id,
              eventType: "STATUS_CHANGED",
              title: "Converted to Student",
              actorId: user.id,
            },
            {
              entityType: "STUDENT",
              entityId: student.id,
              eventType: "CREATED",
              title: "Enrollment Completed",
              actorId: user.id,
            },
          ],
        });

        await tx.audit_Logs.create({
          data: {
            action: "CONVERT_TO_STUDENT",
            entityId: application.id,
            actorId: user.id,
            entityType: "ADMISSION",
            createdAt: new Date(),
            metadata: {
              StudentRollNo: rollNumber,
              StudentName: application.lead?.name,
              StudentEmail: application.lead?.email,
              StudentPhone: application.lead?.phone,
            },
          },
        });

        return {
          message: "Application converted successfully",
          student_id: student.id,
          roll_number: rollNumber,
          application_id: application.id,
          program_id: application.programId,
        };
      });

      // 🔔 STUDENT ENROLLED EVENT (AFTER COMMIT)
      this.eventEmitter.emit("application.student_enrolled", {
        applicationId: result.application_id,
        studentId: result.student_id,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //get student profile
  async getStudentProfile(studentId: string, reqUser: User) {
    try {
      //invalid uuid
      if (!isUUID(studentId)) {
        throw new BadRequestException("Invalid UUID format");
      }
      //find profile of student
      const profile = await this.prisma.student.findUnique({
        where: {
          id: studentId,
        },
        //include application for guardian and personal details
        include: {
          application: true,
        },
      });
      //invalid studentId
      if (!profile) {
        throw new BadRequestException("Invalid studentId");
      }

      //profiledata
      const profileData = profile.profile_data as StudentProfileData;

      //formdata for guardian details
      const formData: any = profile.application?.formData;
      return {
        StudentProfile: {
          //personal details
          personalDetails: {
            name: profileData.personal?.name
              ? await CryptoUtil.decrypt(profileData.personal.name)
              : null,
            email: profileData.personal?.email
              ? await CryptoUtil.decrypt(profileData.personal.email)
              : null,
            phone: profileData.personal?.phone
              ? await CryptoUtil.decrypt(profileData.personal.phone)
              : null,
            dob: formData?.dob,
            gender: formData?.gender,
            bloodGroup: formData?.bloodGroup,
            nationality: formData?.nationality,
          },

          //academic details
          academicDetails: {
            applicationId: profile.application_id,
            programId: profileData.academic.programId,
            rollNumber: profileData.roll_number,
            enrolledDate: profileData.enrolled_at,
          },

          //guardian details
          guardianDetails: {
            guardianName: formData?.guardian?.name,
            guardianEmail: formData?.guardian?.email,
            guardianPhone: formData?.guardian?.phone,
            guardianRelation: formData?.guardian?.relation,
          },

          //emergency contact
          emergencyContact: formData?.emergencyContact,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllStudents() {
    const info = await this.prisma.student.findMany({
      select: {
        id: true,
        profile_data: true,
      },
    });
    const decryptedProfiles = await Promise.all(
      info.map(async (student) => {
        const profile = student.profile_data as AllProfileData;
        const id = student.id;

        return {
          profile_data: {
            studentId: id,
            roll_number: profile.roll_number,
            academic: profile.academic,
            personal: {
              name: profile.personal?.name
                ? await CryptoUtil.decrypt(profile.personal.name)
                : null,
              email: profile.personal?.email
                ? await CryptoUtil.decrypt(profile.personal.email)
                : null,
              phone: profile.personal?.phone
                ? await CryptoUtil.decrypt(profile.personal.phone)
                : null,
            },
            enrolled_at: profile.enrolled_at,
          },
        };
      }),
    );

    return {
      totalStudents: info.length,
      profiles: decryptedProfiles,
    };
  }

  //update student profile
  async updateStudentProfile(
    studentId: string,
    dto: studentProfileUpdateDto,
    reqUser: User,
  ) {
    try {
      //invalid uuid
      if (!isUUID(studentId)) {
        throw new BadRequestException("Invalid UUID format");
      }

      //find student
      const student = await this.prisma.student.findUnique({
        where: {
          id: studentId,
        },
        include: { application: true },
      });
      if (!student) {
        throw new BadRequestException("invalid studentId");
      }

      //created profile and form data to insert
      const profileData = student.profile_data as any;
      const formData: any = student.application?.formData || {};

      //changing profile data if given
      if (dto.name) {
        profileData.personal.name = await CryptoUtil.encrypt(dto.name);
      }
      if (dto.email) {
        profileData.personal.email = await CryptoUtil.encrypt(dto.email);
      }
      if (dto.phone) {
        profileData.personal.phone = await CryptoUtil.encrypt(dto.phone);
      }

      //updating form data if given
      if (dto.dob) formData.dob = dto.dob;
      if (dto.gender) formData.gender = dto.gender;
      if (dto.bloodGroup) formData.bloodGroup = dto.bloodGroup;
      if (dto.nationality) formData.nationality = dto.nationality;

      //updating guardian details if given
      if (
        dto.guardianName ||
        dto.guardianEmail ||
        dto.guardianPhone ||
        dto.guardianRelation
      ) {
        formData.guardian = {
          ...formData.guardian,
          name: dto.guardianName ?? formData.guardian?.name,
          email: dto.guardianEmail ?? formData.guardian?.email,
          phone: dto.guardianPhone ?? formData.guardian?.phone,
          relation: dto.guardianRelation ?? formData.guardian?.relation,
        };
      }

      //updating emergency contact if given
      if (dto.emergencyName || dto.emergencyPhone) {
        formData.emergencyContact = {
          ...formData.emergencyContact,
          name: dto.emergencyName ?? formData.emergencyContact?.name,
          phone: dto.emergencyPhone ?? formData.emergencyContact?.phone,
        };
      }

      //updating both tables as per data
      await this.prisma.$transaction(async (tx) => {
        await tx.student.update({
          where: { id: studentId },
          data: {
            profile_data: profileData,
            updated_by_id: reqUser.id,
            updated_at: new Date(),
          },
        });

        await tx.application.update({
          where: { id: student.application_id },
          data: {
            formData: formData,
            updatedAt: new Date(),
          },
        });
        await tx.audit_Logs.create({
          data: {
            action: "STUDENT_PROFILE_UPDATE",
            entityType: "STUDENT_PROFILE",
            entityId: studentId,
            actorId: reqUser.id,
            metadata: {
              message: "student profile updated",
              newProfileData: profileData,
              newFormData: formData,
            },
          },
        });
      });

      return {
        message: "Student profile updated successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //create timetable for batch
  async createTimetable(batchId: string, dto: UpdateTimetable, reqUser: User) {
    //invalid uuid
    if (!isUUID(batchId)) {
      throw new BadRequestException("Invalid UUID format");
    }

    //find batch
    const batch = await this.prisma.batch.findUnique({
      where: {
        id: batchId,
      },
    });

    //batch not found
    if (!batch) {
      throw new NotFoundException("Invalid batchId");
    }

    for (const day in dto.timetable) {
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
      }
    }
    const timetableJson: Prisma.InputJsonValue = JSON.parse(
      JSON.stringify(dto.timetable),
    );

    const action = batch.timetable ? "TIMETABLE_UPDATED" : "TIMETABLE_CREATED";
    //update table
    await this.prisma.batch.update({
      where: {
        id: batchId,
      },
      data: {
        timetable: timetableJson,
        updated_at: new Date(),
      },
    });

    //update audit_logs
    await this.prisma.audit_Logs.create({
      data: {
        action: action,
        entityType: "BATCH",
        entityId: batchId,
        actorId: reqUser.id,
        metadata: {
          message: action,
          timetable: timetableJson,
        },
      },
    });

    //return data
    return {
      batchId: batchId,
      schedule: dto.timetable,
    };
  }

  //get timetable of batch
  async getTimetable(batchId: string) {
    //invalid uuid
    if (!isUUID(batchId)) {
      throw new BadRequestException("Invalid UUID format");
    }
    //find batch
    const batch = await this.prisma.batch.findUnique({
      where: {
        id: batchId,
      },
    });

    //invalid batchId
    if (!batch) {
      throw new NotFoundException("Invalid batchId");
    }

    //return batchId with schedule(timetable)
    return {
      batchId: batchId,
      schedule: batch.timetable,
    };
  }
}
