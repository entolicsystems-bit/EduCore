import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { NotificationService } from "../notification.service";
import { NotificationEvents } from "src/constants/notification-event.constant";
import { CryptoUtil } from "src/common/crypto/crypto.util";

interface StudentProfileData {
  roll_number: string;
}

function isStudentProfileData(value: unknown): value is StudentProfileData {
  return (
    typeof value === "object" &&
    value !== null &&
    "roll_number" in value &&
    typeof (value as any).roll_number === "string"
  );
}
@Injectable()
export class StudentEnrolledListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent("application.student_enrolled")
  async handle(payload: { applicationId: string; studentId: string }) {
    const application = await this.prisma.application.findUnique({
      where: { id: payload.applicationId },
      include: { lead: true },
    });
    const student = await this.prisma.student.findUnique({
      where: { id: payload.studentId },
    });

    if (!application?.lead?.email) return;

    const email = await CryptoUtil.decrypt(application.lead.email);
    const name = await CryptoUtil.decrypt(application.lead.name);

    let rollNumber = "";
    if (isStudentProfileData(student.profile_data)) {
      rollNumber = student.profile_data.roll_number;
    }

    await this.notificationService.notify(NotificationEvents.STUDENT_ENROLLED, {
      to: email,
      studentName: name,
      programId: application.programId,
      rollNumber: rollNumber,
      applicationRef: application.applicationRef,
    });
  }
}