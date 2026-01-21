// src/notifications/notification.module.ts

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationHandlers } from './notification.handlers';
import { EmailModule } from './email/email.module';
import { DocumentVerifiedListener } from './listeners/document-verified.listener';
import { OfferLetterListener } from './listeners/offer-letter.listener';
import { StudentEnrolledListener } from './listeners/student-enrolled.listener';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [EmailModule],
  providers: [
    NotificationService,
    NotificationHandlers, // ✅ REQUIRED
    DocumentVerifiedListener,
    OfferLetterListener,
    StudentEnrolledListener,
    PrismaService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
