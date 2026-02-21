import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateStaffDto } from './../../dto/staff-register.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { StaffService } from "./staff.service";
import { StaffStatus } from "@prisma/client";
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller("api/v1/staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // POST /staff
 @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateStaffDto, @Req() req) {
    return this.staffService.createStaff(dto, req.user.id);
  }

  // GET /staff

   @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
  @Get()
  findAll(@Query() query, @Req() req) {
    return this.staffService.getStaffList(query, req.user.id);
  }

  // PATCH /staff/:id/status
   @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: StaffStatus,
    @Req() req,
  ) {
    return this.staffService.updateStatus(
      id,
      status,
      req.user.id,
    );
  }

     @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
  @Delete(":id")
softDelete(@Param("id") id: string, @Req() req) {
  return this.staffService.softDeleteStaff(id, req.user.id);
}
}