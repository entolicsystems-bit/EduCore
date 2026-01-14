import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { DocumentUploadDto } from "src/dto/document-upload-dto";
import { documentService } from "./document.service";
import { Roles } from "src/common/decorator/roles.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";

@Controller("v1/documents")
export class documentController {
  constructor(private readonly documentService: documentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Post("upload")
  async uploadDocument(@Body() dto: DocumentUploadDto, @Req() req) {
    return this.documentService.uploadDocument(dto, req.user);
  }
}
