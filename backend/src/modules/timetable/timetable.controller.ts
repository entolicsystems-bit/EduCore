import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { Roles } from "src/common/decorator/roles.decorator";
import { UpdateTimetable } from "src/dto/updateTimetable.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { TimetableService } from "./timetable.service";

@Controller("v1")
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "TEACHER")
  @Patch("batches/:id/timetable")
  updateBatch(
    @Param("id") batchId: string,
    @Body() dto: UpdateTimetable,
    @Req() req,
  ) {
    return this.timetableService.updateTimetable(batchId, dto, req.user);
  }

  @Get("batches/:id/timetable")
  getTimetable(@Param("id") batchId: string) {
    return this.timetableService.getTimetable(batchId);
  }
}
