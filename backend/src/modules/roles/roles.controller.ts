import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Roles } from "../../common/decorator/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { AssignRoleDto } from "../../dto/assign-role.dto";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";

@Controller("v1/roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("assign")
  assignRole(@Body() dto: AssignRoleDto) {
    return this.rolesService.assignRole(dto.userId, dto.roleId);
  }

  
}
