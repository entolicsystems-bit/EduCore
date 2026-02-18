import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.logger.log("✅ Resend Initialized");
  }

  // ===========================
  // Sender Email Selector
  // ===========================
  private getEmailAddress(type: "contact" | "hr"): string {
    if (type === "contact") {
      return "contact@entolicsystems.com";
    }
    return "hr@entolicsystems.com";
  }

  // ===========================
  // PUBLIC METHODS
  // ===========================

  async sendApplicationSubmitted(payload: any) {
    return this.sendTemplate(
      payload.to,
      "Application Submitted",
      "application-submitted.html",
      payload,
      "hr"
    );
  }

  async sendDocumentVerified(payload: any) {
    return this.sendTemplate(
      payload.to,
      "Documents Verified",
      "document-verified.html",
      payload,
      "hr"
    );
  }

  async sendStatusChanged(payload: any) {
    return this.sendTemplate(
      payload.to,
      "Application Status Updated",
      "status-changed.html",
      payload,
      "hr"
    );
  }

  async sendOfferLetter(payload: any) {
    return this.sendTemplate(
      payload.to,
      "Offer Letter Available",
      "offer-letter.html",
      payload,
      "hr"
    );
  }

  async sendStudentEnrolled(payload: any) {
    return this.sendTemplate(
      payload.to,
      "Welcome to EduCore 🎓",
      "welcome-student.html",
      payload,
      "contact"
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
    senderType: "contact" | "hr"
  ) {
    if (!to) {
      throw new Error("Recipient email missing");
    }

    const templatePath = path.resolve(
      process.cwd(),
      "src/modules/notifications/email/templates",
      templateName
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templateName}`);
    }

    let html = fs.readFileSync(templatePath, "utf8");

    // Replace {{key}} placeholders
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(
        new RegExp(`{{\\s*${key}\\s*}}`, "g"),
        String(value ?? "")
      );
    }

    const response = await this.resend.emails.send({
      from: `EduCore <${this.getEmailAddress(senderType)}>`,
      to,
      subject,
      html,
    });

    if (response.data) {
      this.logger.log(`✅ Email sent to ${to} | ID: ${response.data.id}`);
    } else {
      this.logger.error(`❌ Email failed`, response.error);
    }

    return response;
  }
}
