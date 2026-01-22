// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   Query,
//   Req,
//   UseGuards,
// } from "@nestjs/common";
// import { RolesService } from "./roles.service";
// import { Roles } from "../../common/decorator/roles.decorator";
// import { RolesGuard } from "../../guards/roles.guard";
// import { AssignRoleDto } from "../../dto/assign-role.dto";
// import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
// import { RegisterDto } from "src/dto/register.dto";
// import { PrismaService } from "src/database/prisma.service";

// @Controller("v1/roles")
// export class RolesController {
//   constructor(
//     private rolesService: RolesService,
//     private readonly prisma: PrismaService
//   ) {}

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles("ADMIN")
//   @Post("create")
//   createStaff(@Body() dto: RegisterDto, @Req() req) {
//     return this.rolesService.registerStaff(dto, req.user);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles("ADMIN")
//   @Get()
//   getAllStaff() {
//     return this.rolesService.getAllStaff();
//   }

//   @Post("assign")
//   assignStaff(@Body() dto:AssignRoleDto) {
//     try {
//       return this.rolesService.assignRole(dto.userId, dto.roleId);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles("ADMIN")
//   @Get("staff/search")
//   search(@Query("name") name: string) {
//     return this.rolesService.searchStaffByName(name);
//   }
// }

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../common/decorator/roles.decorator";
import { RegisterDto } from "src/dto/register.dto";

@Controller("v1/roles")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //Register staff
  @Post("register")
  registerStaff(@Body() dto: RegisterDto, @Req() req) {
    // req.user.id comes from JWT
    return this.rolesService.registerStaff(dto, req.user.id);
  }

  //add roles to existing user
  @Post("add-role")
  addRole(@Body() body: { userId: string; role: string }) {
    return this.rolesService.addRoleToExistingUser(body.userId, body.role);
  }

  //get all staff
  @Get("staff")
  getAllStaff() {
    return this.rolesService.getAllStaff();
  }

  //get user by id
  @Get("staff/by-id")
  getStaffById(@Query("id") id: string) {
    return this.rolesService.searchStaffById(id);
  }

  //get user by name
  @Get("staff/by-name")
  searchStaffByName(@Query("name") name: string) {
    return this.rolesService.searchStaffByName(name);
  }
}
