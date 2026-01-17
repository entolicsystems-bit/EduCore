import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApplicationStatus } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('v1/applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // EPIC-1: Create Draft
  @Post('create')
  create(@Body() dto: CreateApplicationDto, @Req() req: any) {
    return this.applicationService.createApplication(dto, req.user);
  }


  // ===========================
// EPIC-1: UPDATE APPLICATION FORM (STEP-WISE)
// ===========================
@Patch(':id')
updateApplicationForm(
  @Param('id') applicationId: string,
  @Body('formData') formData: any,
  @Req() req: any,
) {
  return this.applicationService.updateApplicationForm(
    applicationId,
    formData,
    req.user,
  );
}


  // EPIC-1: Submit Application
  @Post(':id/submit')
  submit(@Param('id') id: string, @Req() req: any) {
    return this.applicationService.submitApplication(id, req.user);
  }

  // EPIC-3: Pipeline Status
  @Patch(':id/status')
  @Roles('COUNSELOR', 'ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
    @Body('notes') notes: string,
    @Req() req: any,
  ) {
    return this.applicationService.updateApplicationStatus(
      id,
      status,
      notes,
      req.user,
    );
  }

// ===========================
// EPIC 3.3 — APPLICATION TIMELINE
// ===========================
@Get(':id/timeline')
getTimeline(@Param('id') applicationId: string, @Req() req: any) {
  return this.applicationService.getApplicationTimeline(
    applicationId,
    req.user,
  );
}

}
