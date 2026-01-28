import { OfferLetterService } from './offer-letter.service';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { StorageService } from "./storage/awsStorage.service";

@Controller("v1/offer-letter")
export class offerLetterController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly offerLetterService: OfferLetterService, // ✅ FIX

  ) {}


  @Get(":applicationId/download")
  async downloadOfferLetter(@Param("applicationId") applicationId: string) {
    const offerLetter = await this.prisma.offerLetter.findFirst({
      where: { application_id: applicationId },
    });

    if (!offerLetter) {
      throw new NotFoundException("Offer letter not found");
    }

    const signedUrl = this.storage.getSignedUrl(offerLetter.file_key);
  


  // ✅ MAIL 
  this.offerLetterService.emitOfferLetterMail(
    applicationId,
    signedUrl
  );

    return {
      success: true,
      url: signedUrl,
    };
  }
}