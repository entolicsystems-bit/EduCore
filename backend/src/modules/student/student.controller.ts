import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
  Delete,
} from "@nestjs/common";

import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { Roles } from "src/common/decorator/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { StudentService } from "./student.service";
import { studentProfileUpdateDto } from "src/dto/studentupdate.dto";
import { UpdateTimetable } from "src/dto/updateTimetable.dto";
import { retry } from "rxjs";

@Controller("v1")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post("applications/:id/convert-to-student")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
  convertLead(@Param("id") applicationId: string, @Req() req) {
    return this.studentService.convertLead(applicationId, req.user);
  }

  @Get("profile/students/:id")
  getStudent(@Param("id") studentId: string, @Req() req) {
    return this.studentService.getStudentProfile(studentId, req.user);
  }

  @Get("profile/students")
  getAllStudent() {
    return this.studentService.getAllStudents();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "TEACHER")
  @Patch("profile/students/:id")
  updateStudent(
    @Param("id") studentId: string,
    @Body() dto: studentProfileUpdateDto,
    @Req() req,
  ) {
    return this.studentService.updateStudentProfile(studentId, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "TEACHER")
  @Delete("profile/student/:id")
  deleteStudent(@Param("id") studentId: string) {
    return this.studentService.deleteStudent(studentId);
  }

}
