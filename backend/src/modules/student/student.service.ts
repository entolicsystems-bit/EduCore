import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ApplicationStatus } from "@prisma/client";
import { DocumentStatus } from "src/dto/verify-document.dto";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async convertLead(applicationId: string, user: any) {
    try {
      return this.prisma.$transaction(async (tx) => {
        //find application
        const application = await tx.application.findUnique({
          where: { id: applicationId },
          include: {
            admissionDocuments: true,
            lead: true,
          },
        });

        //If application not found trow error
        if (!application) {
          throw new BadRequestException("Application not found");
        }

        //if application is not aproved
        if (application.status !== ApplicationStatus.DOCUMENT_VERIFIED) {
          throw new BadRequestException(
            "Only VERIFIED applications can be converted",
          );
        }

        //find student is created?
        const existingStudent = await tx.student.findUnique({
          where: { application_id: application.id },
        });

        //already converted to student
        if (existingStudent) {
          throw new BadRequestException(
            "Application already converted to student",
          );
        }

        //documents verified?
        const unverifiedDocs = application.admissionDocuments.filter(
          (d) => d.status !== DocumentStatus.VERIFIED,
        );

        //not verified documents
        if (unverifiedDocs.length > 0) {
          throw new BadRequestException(
            "All required documents must be verified",
          );
        }

        //create roll no
        const rollNumber = `STU-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`;

        //create student details
        const student = await tx.student.create({
          data: {
            application_id: application.id,
            user_id: application.reviewedBy ?? user.id,
            tenant_id: application.tenantId,
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

        //change application status to enrolled
        await tx.application.update({
          where: { id: application.id },
          data: {
            status: ApplicationStatus.ENROLLED,
            updatedAt: new Date(),
          },
        });

        const timeToConversionMs =
          new Date().getTime() - new Date(application.lead.createdAt).getTime();

        await tx.lead.update({
          where: { id: application.leadId },
          data: {
            status: "CONVERTED",
            id: student.id,
            // is_converted: true,
          },
        });

        //create timeLine activity
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

        //create auditLog
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

        //responce
        return {
          message: "Application converted successfully",
          student_id: student.id,
          roll_number: rollNumber,
          application_id: application.id,
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
