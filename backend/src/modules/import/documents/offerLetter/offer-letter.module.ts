// src/modules/offer-letter/offer-letter.module.ts
import { Module } from "@nestjs/common";
import { OfferLetterService } from "./offer-letter.service";
import { offerLetterController } from "./offer-letter.controller";
import { PrismaService } from "src/database/prisma.service";
import { StorageService } from "./storage/awsStorage.service";

@Module({
  controllers: [offerLetterController],
  providers: [
    OfferLetterService,
    PrismaService,
    StorageService,
  ],
})
export class OfferLetterModule {}
