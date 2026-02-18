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

import { EventEmitter2 } from "@nestjs/event-emitter";
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ApplicationStatus, User } from "@prisma/client";
import { DocumentStatus } from "src/dto/verify-document.dto";
import { CryptoUtil } from "src/common/crypto/crypto.util";
import { isUUID } from "class-validator";
import { studentProfileUpdateDto } from "src/dto/studentupdate.dto";
import { CreateTimetableDto } from "src/dto/createTimetable.dto";

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async convertLead(applicationId: string, user: any) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
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
            // keep fallback → safer in production
            branch_id: application.branchId ?? user.branchId,
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

  // ---------------- GET PROFILE ----------------
  async getStudentProfile(studentId: string, reqUser: User) {
    try {
      if (!isUUID(studentId)) {
        throw new BadRequestException("Invalid UUID format");
      }

      const profile = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { application: true },
      });

      if (!profile) {
        throw new BadRequestException("Invalid studentId");
      }

      const profileData = profile.profile_data as StudentProfileData;
      const formData: any = profile.application?.formData;

      return {
        StudentProfile: {
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
          academicDetails: {
            applicationId: profile.application_id,
            programId: profileData.academic?.programId,
            rollNumber: profileData.roll_number,
            enrolledDate: profileData.enrolled_at,
          },
          guardianDetails: {
            guardianName: formData?.guardian?.name,
            guardianEmail: formData?.guardian?.email,
            guardianPhone: formData?.guardian?.phone,
            guardianRelation: formData?.guardian?.relation,
          },
          emergencyContact: formData?.emergencyContact,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ---------------- UPDATE PROFILE ----------------
  async updateStudentProfile(
    studentId: string,
    dto: studentProfileUpdateDto,
    reqUser: User,
  ) {
    try {
      if (!isUUID(studentId)) {
        throw new BadRequestException("Invalid UUID format");
      }

      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { application: true },
      });

      if (!student) {
        throw new BadRequestException("invalid studentId");
      }

      const profileData = student.profile_data as any;
      const formData: any = student.application?.formData || {};

      if (dto.name) {
        profileData.personal.name = await CryptoUtil.encrypt(dto.name);
      }
      if (dto.email) {
        profileData.personal.email = await CryptoUtil.encrypt(dto.email);
      }
      if (dto.phone) {
        profileData.personal.phone = await CryptoUtil.encrypt(dto.phone);
      }

      if (dto.dob) formData.dob = dto.dob;
      if (dto.gender) formData.gender = dto.gender;
      if (dto.bloodGroup) formData.bloodGroup = dto.bloodGroup;
      if (dto.nationality) formData.nationality = dto.nationality;

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

      if (dto.emergencyName || dto.emergencyPhone) {
        formData.emergencyContact = {
          ...formData.emergencyContact,
          name: dto.emergencyName ?? formData.emergencyContact?.name,
          phone: dto.emergencyPhone ?? formData.emergencyContact?.phone,
        };
      }

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
            formData,
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

      return { message: "Student profile updated successfully" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
