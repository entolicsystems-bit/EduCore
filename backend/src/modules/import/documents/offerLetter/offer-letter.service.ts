import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { PrismaService } from "src/database/prisma.service";
import { htmlToPdf } from "src/utils/pdf.util";
import { StorageService } from "./storage/awsStorage.service";
import { ApplicationStatus } from "@prisma/client";
import { CryptoUtil } from "src/common/crypto/crypto.util";

@Injectable()
export class OfferLetterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly eventEmitter: EventEmitter2, // ✅ correct
  ) {
    console.log("OfferLetterService initialized");
  }

  //Logo Base64
  private getLogoBase64(): string {
    const logoPath = path.join(__dirname, "templates", "logo.jpg");

    if (!fs.existsSync(logoPath)) {
      throw new Error(`Logo not found at ${logoPath}`);
    }

    const file = fs.readFileSync(logoPath);
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  }

  //Build html for reviewing offerLetter
  private async buildHtml(applicationId: string): Promise<string> {
    console.log("Building html");
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { lead: true },
    });

    //program currently static
    const program = {
      name: application.programId,
      duration: "4 Years",
      startDate: new Date(),
      totalFee: "₹4,00,000",
    };

    //data to fill offerLetter
    const data = {
      // Institution
      INSTITUTION_LOGO: this.getLogoBase64(),
      INSTITUTION_NAME: "Entolic System",
      INSTITUTION_ADDRESS: "Pune, India",
      INSTITUTION_CONTACT: "+91-9999999999",

      // Student
      STUDENT_NAME: await CryptoUtil.decrypt(application.lead.name),
      STUDENT_EMAIL: application.lead.email,
      APPLICATION_ID: application.applicationRef,

      // Program
      PROGRAM_NAME: program.name,
      PROGRAM_DURATION: program.duration,
      START_DATE: this.formatDate(program.startDate),

      // Offer
      TOTAL_FEE: program.totalFee,
      OFFER_DATE: this.formatDate(new Date()),
      ACCEPTANCE_DEADLINE: this.formatDate(this.addDays(new Date(), 10)),
    };

    const templatePath = path.join(__dirname, "templates", "offer-letter.html");

    let html = fs.readFileSync(templatePath, "utf8");

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), String(value ?? ""));
    });

    return html;
  }

  //The calling function which calls buildhtml
  async preview(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { lead: true },
    });

    //applicationId not found
    if (!application) {
      throw new NotFoundException("Invalid applicationId");
    }

    if (application.status !== ApplicationStatus.APPLIED) {
      throw new BadRequestException(
        "Cannot preview non APPLIED documents offerLetter",
      );
    }
    try {
      const html = await this.buildHtml(applicationId);

      return {
        success: true,
        html,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  //Generate offerLetter only one time
  async generate(applicationId: string, adminId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { lead: true },
    });

    //applicationId not found
    if (!application) {
      throw new NotFoundException("Invalid applicationId");
    }

    if (application.status !== ApplicationStatus.DOCUMENT_VERIFIED) {
      throw new BadRequestException(
        "Cannot Generate non verified documents offerLetter",
      );
    }
    const existingOffer = await this.prisma.offerLetter.findFirst({
      where: { application_id: applicationId },
    });

    if (existingOffer) {
      throw new BadRequestException("Offer letter already generated");
    }

    const html = await this.buildHtml(applicationId);

    // Convert HTML → PDF
    const pdfBuffer = await htmlToPdf(html);

    // Generate secure storage key
    const fileKey = `OfferLetters/${applicationId}_${Date.now()}.pdf`;

    // Upload to cloud
    await this.storage.uploadPdf(pdfBuffer, fileKey);

    const offerLetter = await this.prisma.offerLetter.create({
      data: {
        application_id: applicationId,
        file_key: fileKey,
        generated_by: adminId,
        generated_at: new Date(),
      },
    });

    //   console.log(
    // '🚀 EMITTING application.offer_letter_ready',
    // applicationId,

    return {
      success: true,
      offerLetter_Id: offerLetter.id,
      FileKey: fileKey,
    };
  }
  //Emit event to send offer letter email
  emitOfferLetterMail(applicationId: string, signedUrl: string) {
    this.eventEmitter.emit("application.offer_letter_ready", {
      applicationId,
      signedUrl,
    });
  }

  //Helpers functions
  private formatDate(date: Date) {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  private addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
}
