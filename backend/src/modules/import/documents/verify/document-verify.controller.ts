import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { VerifyDocumentDto } from 'src/dto/verify-document.dto';
import { VerifyDocumentService } from './document-verify.service';

@Controller('v1/documents')
export class VerifyDocumentController {
  constructor(private readonly verifyDocumentService: VerifyDocumentService) {}


  //single document verify
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/verify')
  verifyOneDocument(
    @Param('id') documentId: string,
    @Body() dto: VerifyDocumentDto,
    @Req() req,
  ) {
    return this.verifyDocumentService.verifyOneDocument(documentId, dto, req.user);
  }

  //bulk document verify
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('bulk/verify')
  bulkVerifyDocuments(
    @Body() body: { documentIds: string[]; dto: VerifyDocumentDto },
    @Req() req,
  ) {
    return this.verifyDocumentService.bulkVerifyDocuments(
      body.documentIds,
      body.dto,
      req.user,
    );
  }
}
