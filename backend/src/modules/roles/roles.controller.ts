import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Roles } from "../../common/decorator/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { AssignRoleDto } from "../../dto/assign-role.dto";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RegisterDto } from "src/dto/register.dto";
import { PrismaService } from "src/database/prisma.service";

@Controller("v1/roles")
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private readonly prisma: PrismaService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("create")
  createStaff(@Body() dto: RegisterDto, @Req() req) {
    return this.rolesService.registerStaff(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Get()
getAllStaff() {
  return this.rolesService.getAllStaff();
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Get("staff/search")
search(@Query("name") name: string) {
  return this.rolesService.searchStaffByName(name);
}
}
