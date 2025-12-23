import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from '../../dto/create-lead.dto';
import { LeadFilterDto } from '../../dto/lead-filter.dto';
import { LeadTimelineDto } from '../../dto/lead-timeline.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('v1/leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  // 🔓 PUBLIC — website/manual lead
  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.service.createWebsiteLead(dto);
  }

  // 🔓 PUBLIC — list leads
  @Get()
  list(@Query() filters: LeadFilterDto) {
    return this.service.getLeads(filters);
  }

  // 🔓 PUBLIC — lead details
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.service.getLead(id);
  }

  // 🔓 PUBLIC — timeline
  @Get(':id/timeline')
  timeline(
    @Param('id') id: string,
    @Query() query: LeadTimelineDto,
  ) {
    return this.service.getLeadTimeline(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateLead(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req,
  ) {
    return this.service.updateLead(id, body, req.user);
  }



  // 🔐 PROTECTED — counsellor creates lead
@UseGuards(JwtAuthGuard)
@Post('counsellor')
createByCounsellor(
  @Body() dto: CreateLeadDto,
  @Req() req,
) {
  return this.service.createCounsellorLead(dto, req.user.id);
}




  // 🔐 PROTECTED — admin assigns counsellor
  @UseGuards(JwtAuthGuard)
  @Post(':id/assign')
  assignCounsellor(
    @Param('id') leadId: string,
    @Body() body: { counsellorId: string },
    @Req() req,
  ) {
    return this.service.assignCounsellor(
      leadId,
      body.counsellorId,
      req.user.id, // ADMIN ID from JWT
    );
  }
}
