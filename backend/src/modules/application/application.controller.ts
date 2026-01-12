import { Controller, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from '../../dto/application.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('v1/applications')
@UseGuards(JwtAuthGuard) //  ENABLED auth guard
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateApplicationDto,
    @Req() req: Request,
  ) {


    return this.applicationService.createApplication(
      dto,
      req.user, // 👈 user context
      
    );

  }

  //  @Post(':id/submit')
  // submit(
  //   @Param('id') applicationId: string,
  //   @Req() req: Request,
  // ) {
  //   return this.applicationService.submitApplication(
  //     applicationId,
  //     req.user,
  //   );

}
