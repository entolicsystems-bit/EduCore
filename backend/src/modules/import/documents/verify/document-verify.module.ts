import { Module } from "@nestjs/common";
import { VerifyDocumentController } from "./document-verify.controller";
import { VerifyDocumentService } from "./document-verify.service";

@Module({
  controllers: [VerifyDocumentController],
  providers: [VerifyDocumentService],
})
export class verifyDocumentModule {}
