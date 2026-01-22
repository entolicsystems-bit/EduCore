import { Module } from "@nestjs/common";
import { documentController } from "./document.controller";
import { documentService } from "./document.service";
import { offerLetterController } from "../offerLetter/offer-letter.controller";
import { StorageModule } from "../offerLetter/storage/awsStorage.module";
import { NotificationModule } from "src/modules/notifications/notification.module";

@Module({
  imports: [StorageModule, NotificationModule],
  controllers: [ documentController],    // Removed offerLetterController
  providers: [documentService],
})
export class documentModule {}
