import { NotificationEvents } from './../../../constants/notification-event.constant';
import { PrismaService } from './../../../database/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { CryptoUtil } from 'src/common/crypto/crypto.util';

@Injectable()
export class DocumentVerifiedListener {
  private readonly logger = new Logger(DocumentVerifiedListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('application.document_verified', { async: true })
  async handleDocumentVerified(payload: {
    applicationId: string;
    adminId: string;
  }) {
    this.logger.log(
      `📥 application.document_verified received for applicationId=${payload.applicationId}`,
    );

    try {
      const application = await this.prisma.application.findUnique({
        where: { id: payload.applicationId },
        include: { lead: true },
      });

      if (!application) {
        this.logger.warn(
          `❌ Application not found: ${payload.applicationId}`,
        );
        return;
      }

      if (!application.lead?.email) {
        this.logger.warn(
          `❌ Lead email missing for applicationId=${payload.applicationId}`,
        );
        return;
      }

      // 🔓 decrypt email
      const email = await CryptoUtil.decrypt(application.lead.email);

      this.logger.log(`📧 Sending DOCUMENT_VERIFIED mail to ${email}`);

      // 📧 send notification
      await this.notificationService.notify(
        NotificationEvents.DOCUMENT_VERIFIED,
        {
          to: email,
          applicationRef: application.applicationRef,
        },
      );

      this.logger.log(
        `✅ DOCUMENT_VERIFIED notification sent for applicationId=${payload.applicationId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send DOCUMENT_VERIFIED mail for applicationId=${payload.applicationId}`,
        error.stack,
      );
    }
  }
}
