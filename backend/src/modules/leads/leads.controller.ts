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
import { Roles } from "src/common/decorator/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";

@Controller("v1/leads")
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  // PUBLIC — website lead
  @Post("create")
  create(@Body() dto: CreateLeadDto) {
    return this.service.createWebsiteLead(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get()
  list(@Query() filters: LeadFilterDto) {
    return this.service.getLeads(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get(":id")
  detail(@Param("id") id: string) {
    return this.service.getLead(id);
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

  // ADMIN / COUNSELLOR create lead
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Post("add")
  createByCounsellor(@Body() dto: CreateLeadDto, @Req() req) {
    return this.service.createCounsellorLead(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Delete("delete/:id")
  sdelete(@Param("id") id: string, @Req() req) {
    return this.service.softDeleteUser(id, req.user);
  }
}



/*

@Controller("v1/leads")
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  //PUBLIC — website/manual lead
  @Post("create")
  create(@Body() dto: CreateLeadDto) {
    return this.service.createWebsiteLead(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get()
  list(@Query() filters: LeadFilterDto) {
    return this.service.getLeads(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR", "TEACHER", "ACCOUNTANT")
  @Get(":id")
  detail(@Param("id") id: string) {
    return this.service.getLead(id);
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

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("ADMIN", "COUNSELLOR")
  // @Delete(":id")
  // deleteLead(@Param("id") id: string, @Req() req) {
  //   return this.service.deleteLead(id, req.user);
  // }

  //counsellor and admin creates lead
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Post("add")
  createByCounsellor(@Body() dto: CreateLeadDto, @Req() req) {
    return this.service.createCounsellorLead(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  @Delete("delete/:id")
  sdelete(@Param("id") id: string, @Req() req) {
    return this.service.softDeleteUser(id, req.user);
  }
}
*/