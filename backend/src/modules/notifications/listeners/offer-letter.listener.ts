import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationService } from '../notification.service';
import { NotificationEvents } from 'src/constants/notification-event.constant';
import { CryptoUtil } from 'src/common/crypto/crypto.util';

@Injectable()
export class OfferLetterListener {
  private readonly logger = new Logger(OfferLetterListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * This listener sends offer letter email
   * using the SAME signed download URL
   * that is generated in download API.
   */
  @OnEvent('application.offer_letter_ready')
  async handle(payload: {
    applicationId: string;
    signedUrl: string;
  }) {
    const { applicationId, signedUrl } = payload;

    this.logger.log(
      `📥 OfferLetterListener received event for application ${applicationId}`,
    );

    // 1️⃣ Fetch application + lead
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { lead: true },
    });

    if (!application || !application.lead) {
      this.logger.error('❌ Application or lead not found');
      return;
    }

    // 2️⃣ Decrypt email
    let email: string | null = null;
    try {
      email = application.lead.email
        ? await CryptoUtil.decrypt(application.lead.email)
        : null;
    } catch (error) {
      this.logger.error('❌ Failed to decrypt lead email', error);
      return;
    }

    if (!email) {
      this.logger.error(
        `❌ Recipient email missing for application ${applicationId}`,
      );
      return;
    }

    // 3️⃣ Validate signed URL
    if (!signedUrl) {
      this.logger.error(
        `❌ Signed download URL missing for application ${applicationId}`,
      );
      return;
    }

    // 4️⃣ Send notification (email)
    await this.notificationService.notify(
      NotificationEvents.OFFER_LETTER_READY,
      {
        to: email,
        applicationRef: application.applicationRef,
        downloadLink: signedUrl, // ✅ EXACT SAME URL AS POSTMAN
      },
    );

    this.logger.log(
      `📧 Offer letter email sent to ${email} for application ${applicationId}`,
    );
  }
}
