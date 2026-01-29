// src/modules/offer-letter/offer-letter.module.ts
import { Module } from "@nestjs/common";
import { OfferLetterService } from "./offer-letter.service";
import { offerLetterController } from "./offer-letter.controller";
import { PrismaService } from "src/database/prisma.service";
import { StorageService } from "./storage/awsStorage.service";
import { ApplicationListener } from "./application.listener";
import { offerLetterpreviewController } from "./offer-letter-preview.controller";

@Module({
  controllers: [offerLetterController,offerLetterpreviewController],
  providers: [
    OfferLetterService,
    PrismaService,
    StorageService,
    ApplicationListener
  ],
  exports: [OfferLetterService],
})
export class OfferLetterModule {}
