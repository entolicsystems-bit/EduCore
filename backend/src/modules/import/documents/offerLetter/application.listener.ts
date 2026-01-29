import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { OfferLetterService } from "./offer-letter.service";
import { writeFileSync } from "fs";

@Injectable()
export class ApplicationListener {
  constructor(private readonly offerLetterService: OfferLetterService) {}

  @OnEvent("application.document_verified", { async: true })
  async onDocumentVerified(payload: {
    applicationId: string;
    adminId: string;
  }) {
    console.log("Event Listened for application:", payload.applicationId);

    try {
      console.log("Starting offer letter generation...");
      const result = await this.offerLetterService.generate(
        payload.applicationId,
        payload.adminId,
      );

      return result;
    } catch (error) {
      console.error("Offer letter generation failed:", error);
    }
  }
}
