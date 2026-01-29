import { Module } from "@nestjs/common";
import { VerifyDocumentController } from "./document-verify.controller";
import { VerifyDocumentService } from "./document-verify.service";
import { OfferLetterService } from "../offerLetter/offer-letter.service";
import { ApplicationListener } from "../offerLetter/application.listener";
import { offerLetterpreviewController } from "../offerLetter/offer-letter-preview.controller";
import { StorageService } from "../offerLetter/storage/awsStorage.service";
import { StorageModule } from "../offerLetter/storage/awsStorage.module";
import { NotificationModule } from "src/modules/notifications/notification.module";
import { OfferLetterModule } from "../offerLetter/offer-letter.module";

@Module({
  imports: [StorageModule, NotificationModule,OfferLetterModule],
  controllers: [VerifyDocumentController],
  providers: [VerifyDocumentService],
  exports: [],
})
export class verifyDocumentModule {}
