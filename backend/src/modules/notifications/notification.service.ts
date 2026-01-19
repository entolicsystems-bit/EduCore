import { Injectable, Logger } from '@nestjs/common';
import { NotificationEvent } from '../../constants/notification-event.constant';
import { NotificationHandlers } from './notification.handler';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly handlers: NotificationHandlers,
  ) {}

  /**
   * Sprint-2 Logical Queue
   * (Direct execution, async-ready)
   */
  async notify(event: NotificationEvent, payload: any) {
    this.logger.log(`📨 Notification queued: ${event}`);

    // Direct handler execution (queue-ready)
    await this.handlers.handle(event, payload);
  }
}
