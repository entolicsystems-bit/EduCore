import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Roles } from "../../common/decorator/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { AssignRoleDto } from "../../dto/assign-role.dto";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RegisterDto } from "src/dto/register.dto";
import { PrismaService } from "src/database/prisma.service";
import { Role } from "@prisma/client";

@Controller("v1/roles")
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private readonly prisma: PrismaService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("assign")
  assignRole(@Body() dto: AssignRoleDto) {
    return this.rolesService.assignRole(dto.userId, dto.roleId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("create")
  createStaff(@Body() dto: RegisterDto) {
    return this.rolesService.registerStaff(dto);
  }
}
