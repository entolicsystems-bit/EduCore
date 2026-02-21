import { Roles } from 'src/common/decorator/roles.decorator';
import { TeacherAssignmentService } from './teacherAssignment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AssignTeacherDto } from "src/dto/assignTeacher.dto";
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller("api/v1/batches")
export class TeacherAssignmentController {
  constructor(
    private readonly teacherAssignmentService: TeacherAssignmentService,
  ) {}

  // ======================================================
  // 1️⃣ ASSIGN TEACHER TO BATCH
  // POST /batches/:batchId/teachers
  // ======================================================
   @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")

  @Post(":batchId/teachers")
  assignTeacher(
    @Param("batchId") batchId: string,
    @Body() dto: AssignTeacherDto,
    @Req() req,
  ) {
    return this.teacherAssignmentService.assignTeacher(
      batchId,
      dto,
      req.user,
    );
  }

  // ======================================================
  // 2️⃣ REMOVE TEACHER FROM BATCH
  // DELETE /batches/:batchId/teachers/:teacherId
  // ======================================================

     @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")

  @Delete(":batchId/teachers/:teacherId")
  removeTeacher(
    @Param("batchId") batchId: string,
    @Param("teacherId") teacherId: string,
    @Req() req,
  ) {
    return this.teacherAssignmentService.removeTeacher(
      batchId,
      teacherId,
      req.user,
    );
  }

  // ======================================================
  // 3️⃣ GET ALL TEACHERS OF A BATCH
  // GET /batches/:batchId/teachers
  // ======================================================
     @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")

  @Get(":batchId/teachers")
  getBatchTeachers(@Param("batchId") batchId: string) {
    return this.teacherAssignmentService.getBatchTeachers(
      batchId,
    );
  }
}