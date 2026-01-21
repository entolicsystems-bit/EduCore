import { NotificationEvents } from '../../../constants/notification-event.constant';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // ===========================
  // TEST EMAIL
  // ===========================
  async sendTestEmail(to: string) {
    await this.transporter.sendMail({
      from: '"EduCore Test" <sakshikohale.rkinfynova@gmail.com>',
      to,
      subject: 'Test Email from EduCore',
      text: 'Email service is working correctly 🎉',
    });

    this.logger.log(`✅ Test email sent to ${to}`);
  }

  // ======================================================
  // PUBLIC METHODS CALLED BY NotificationHandler ✅
  // ======================================================

  async sendApplicationSubmitted(payload: any) {
    return this.sendTemplate(
      payload.to,
      'Application Submitted',
      'application-submitted.html',
      payload,
    );
  }

  async sendDocumentVerified(payload: any) {
    console.log('📧 sendOfferLetter called with', payload);
    return this.sendTemplate(
      payload.to,
      'Documents Verified',
      'document-verified.html',
      payload,
    );
  }

  async sendStatusChanged(payload: any) {
    return this.sendTemplate(
      payload.to,
      'Application Status Updated',
      'status-changed.html',
      payload,
    );
  }

  async sendOfferLetter(payload: any) {
    return this.sendTemplate(
      payload.to,
      'Offer Letter Available',
      'offer-letter.html',
      payload,
    );
  }

  async sendStudentEnrolled(payload: any) {
    return this.sendTemplate(
      payload.to,
      'Welcome to EduCore 🎓',
      'welcome-student.html',
      payload,
    );
  }

  // ===========================
  // INTERNAL TEMPLATE HANDLER
  // ===========================
  private async sendTemplate(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>,
  ) {
    if (!to) throw new Error('Recipient email missing');

    const templatePath = path.resolve(
      process.cwd(),
      'src/modules/notifications/email/templates',
      templateName,
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templateName}`);
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace {{key}} placeholders
    for (const key of Object.keys(data)) {
      html = html.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(data[key] ?? ''),
      );
    }

    await this.transporter.sendMail({
      from: '"EduCore Admissions" <sakshikohale.rkinfynova@gmail.com>',
      to,
      subject,
      html,
    });

    this.logger.log(`✅ Email sent to ${to} | ${subject}`);
  }
}
