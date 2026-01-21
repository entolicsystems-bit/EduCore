import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationService } from '../notification.service';
import { NotificationEvents } from 'src/constants/notification-event.constant';
import { CryptoUtil } from 'src/common/crypto/crypto.util';

@Injectable()
export class StudentEnrolledListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('application.student_enrolled')
  async handle(payload: {
    applicationId: string;
    studentId: string;
  }) {
    const application = await this.prisma.application.findUnique({
      where: { id: payload.applicationId },
      include: { lead: true },
    });

    if (!application?.lead?.email) return;

    const email = await CryptoUtil.decrypt(application.lead.email);
    const name = await CryptoUtil.decrypt(application.lead.name);

    await this.notificationService.notify(
      NotificationEvents.STUDENT_ENROLLED,
      {
        to: email,
        studentName: name,
        applicationRef: application.applicationRef,
      },
    );
  }
}
