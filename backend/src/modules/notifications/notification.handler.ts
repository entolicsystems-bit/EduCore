import { Injectable, Logger } from '@nestjs/common';
import { NotificationEvent, NotificationEvents } from '../../constants/notification-event.constant';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationHandlers {
  private readonly logger = new Logger(NotificationHandlers.name);

  constructor(private readonly emailService: EmailService) {}

  async handle(event: NotificationEvent, payload: any) {
    this.logger.log(`📤 Handling notification: ${event}`);

    switch (event) {
      case NotificationEvents.APPLICATION_SUBMITTED:
        return this.emailService.sendApplicationSubmitted(payload);

      case NotificationEvents.DOCUMENT_VERIFIED:
        return this.emailService.sendDocumentVerified(payload);

      case NotificationEvents.STATUS_CHANGED:
        return this.emailService.sendStatusChanged(payload);

      case NotificationEvents.OFFER_LETTER_READY:
        return this.emailService.sendOfferLetter(payload);

      case NotificationEvents.STUDENT_ENROLLED:
        return this.emailService.sendStudentEnrolled(payload);

      default:
        this.logger.warn(`⚠️ No handler for event: ${event}`);
        return;
    }
  }
}
