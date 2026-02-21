import { enrollstudentDTO } from './../../dto/enroll.student.dto';
import { EnrollmentService } from './student.enroll.service';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
} from "@nestjs/common";


@Controller("batches")
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
  ) {}

  // POST /batches/:id/enroll
  @Post(":id/enroll")
  enroll(
    @Param("id") batchId: string,
    @Body() dto: enrollstudentDTO,
    @Req() req,
  ) {
    return this.enrollmentService.enrollStudent(
      batchId,
      dto.studentId,
      req.user,
    );
  }
}