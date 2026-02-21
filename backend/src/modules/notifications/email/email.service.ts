import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

// ===========================
// Email Service
// ===========================
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing in .env");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.logger.log("✅ Resend Initialized");
  }

  // ===========================
  // Sender Selector
  // ===========================
  private getEmailAddress(type: "contact" | "hr"): string {
    return type === "contact"
      ? "contact@entolicsystems.com"
      : "hr@entolicsystems.com";
  }

  // ===========================
  // PUBLIC METHODS
  // ===========================

  async sendApplicationSubmitted(payload: any) {
    return this.sendTemplate(
      payload?.to,
      "Application Submitted",
      "application-submitted.html",
      payload,
      "hr"
    );
  }

  // For HR to notify candidate about document verification
  async sendDocumentVerified(payload: any) {
    return this.sendTemplate(
      payload?.to,
      "Documents Verified",
      "document-verified.html",
      payload,
      "hr"
    );
  }

  // For HR to notify candidate about document rejection
  async sendStatusChanged(payload: any) {
    return this.sendTemplate(
      payload?.to,
      "Application Status Updated",
      "status-changed.html",
      payload,
      "hr"
    );
  }

  // For HR to send offer letter to candidate
  async sendOfferLetter(payload: any) {
    return this.sendTemplate(
      payload?.to,
      "Offer Letter Available",
      "offer-letter.html",
      payload,
      "hr"
    );
  }

  // For contact form submissions
  async sendStudentEnrolled(payload: any) {
    return this.sendTemplate(
      payload?.to,
      "Welcome to EduCore 🎓",
      "welcome-student.html",
      payload,
      "hr"
    );
  }

  // ===========================
  // TEMPLATE HANDLER
  // ===========================

  private async sendTemplate(
    to: any,
    subject: string,
    templateName: string,
    data: Record<string, any>,
    senderType: "contact" | "hr"
  ) {
    try {
      // ---------------------------
      // Email Validation
      // ---------------------------
      if (!to || typeof to !== "string") {
        throw new Error(`Invalid recipient email: ${to}`);
      }

      const email = to.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        throw new Error(`Email format invalid: ${email}`);
      }

      // ---------------------------
      // Load Template
      // ---------------------------
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
      for (const [key, value] of Object.entries(data || {})) {
        html = html.replace(
          new RegExp(`{{\\s*${key}\\s*}}`, "g"),
          String(value ?? "")
        );
      }

      // ---------------------------
      // Send Email via Resend
      // ---------------------------
      const response = await this.resend.emails.send({
        from: `EduCore <${this.getEmailAddress(senderType)}>`,
        to: email,
        subject,
        html,
      });

      if (response?.data) {
        this.logger.log(
          `✅ Email sent to ${email} | ID: ${response.data.id}`
        );
      } else {
        this.logger.error(
          `❌ Email failed`,
          response?.error || response
        );
      }

      return response;
    } catch (error) {
      this.logger.error("❌ Email sending error", error);
      throw error;
    }
  }
}
