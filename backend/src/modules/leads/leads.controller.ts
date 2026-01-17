// src/modules/leads/leads.controller.ts

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
  Delete,
} from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "../../dto/create-lead.dto";
import { LeadFilterDto } from "../../dto/lead-filter.dto";
import { LeadTimelineDto } from "../../dto/lead-timeline.dto";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { Roles } from "../../common/decorator/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";

@Controller("v1/leads")
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  // PUBLIC
  @Post("create")
  create(@Body() dto: CreateLeadDto) {
    return this.service.createWebsiteLead(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get()
  getLeads(@Query() filters: LeadFilterDto, @Req() req) {
    return this.service.getLeads(filters, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get(":id")
  detail(@Param("id") id: string, @Req() req) {
    return this.service.getLead(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get(":id/timeline")
  timeline(@Param("id") id: string, @Query() query: LeadTimelineDto) {
    return this.service.getLeadTimeline(id, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Patch(":id")
  updateLead(@Param("id") id: string, @Body() body: any, @Req() req) {
    return this.service.updateLead(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Post("add")
  createByCounsellor(@Body() dto: CreateLeadDto, @Req() req) {
    return this.service.createCounsellorLead(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Delete("delete/:id")
  delete(@Param("id") id: string, @Req() req) {
    return this.service.softDeleteUser(id, req.user);
  }
}
