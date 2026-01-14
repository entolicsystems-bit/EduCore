import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('v1/applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  /**
   * Create & Submit Application
   * Status: APPLIED
   * EPIC-1.2.1
   */
  @Post('create')
  async createApplication(
    @Body() dto: CreateApplicationDto,
    @Req() req
  ) {
    return this.applicationService.createApplication(
      dto,
      req.user, // contains id, tenantId, branchId
    );
  }
}
