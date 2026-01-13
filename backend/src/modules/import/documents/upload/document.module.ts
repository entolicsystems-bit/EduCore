import { Module } from "@nestjs/common";
import { documentController } from "./document.controller";
import { documentService } from "./document.service";

@Module({
  controllers: [documentController],
  providers: [documentService],
})
export class documentModule {}
