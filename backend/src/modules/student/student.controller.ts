import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
} from "@nestjs/common";


import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { Roles } from "src/common/decorator/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { StudentService } from "./student.service";

@Controller("v1/applications")
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post(":id/convert-to-student")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  convertLead(@Param("id") applicationId: string, @Req() req) {
    return this.studentService.convertLead(applicationId, req.user);
  }
}
