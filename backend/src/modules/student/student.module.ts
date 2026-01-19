import { Module } from "@nestjs/common";

import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "../auth/auth.module";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
  imports: [DatabaseModule, AuthModule],

  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
