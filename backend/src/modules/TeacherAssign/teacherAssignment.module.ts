import { Module } from "@nestjs/common";
import { TeacherAssignmentController } from "./teacherAssignment.controlle";
import { TeacherAssignmentService } from "./teacherAssignment.service";

// ✅ Teacher Assignment Module
@Module({
  controllers: [TeacherAssignmentController],
  providers: [TeacherAssignmentService],
})
export class TeacherAssignmentModule {}