import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "src/dto/create-course.dto";
import { UpdateCourseDto } from "src/dto/update-course.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/common/decorator/roles.decorator";

@Controller("courses")
export class CourseController {

  constructor(private readonly courseService: CourseService) {}

  // ================= CREATE COURSE =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  // ================= GET ALL COURSES =================
  // Example → /courses?tenantId=uuid
  @Get()
  async findAll(@Query("tenantId") tenantId: string) {
    return this.courseService.findAll(tenantId);
  }

  // ================= GET COURSE BY ID =================
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.courseService.findOne(id);
  }

  // ================= UPDATE COURSE =================
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCourseDto
  ) {
    return this.courseService.update(id, dto);
  }

  // ================= DELETE COURSE =================
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.courseService.delete(id);
  }
}
