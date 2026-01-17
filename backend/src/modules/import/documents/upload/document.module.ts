import { Module } from "@nestjs/common";
import { documentController } from "./document.controller";
import { documentService } from "./document.service";
import { offerLetterController } from "../offerLetter/offer-letter.controller";
import { StorageModule } from "../offerLetter/storage/awsStorage.module";

@Module({
  imports: [StorageModule],
  controllers: [ offerLetterController,documentController],
  providers: [documentService],
})
export class documentModule {}
