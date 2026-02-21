import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "../auth/auth.module";
import { Module } from "@nestjs/common";
import { TimetableController } from "./timetable.controller";
import { TimetableService } from "./timetable.service";

@Module({
  imports: [DatabaseModule,AuthModule],

  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule {}
