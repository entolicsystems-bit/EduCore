import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req
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
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async create(@Body() dto: CreateCourseDto, @Req() req) {
    // console.log(`User data : ${req.user.role}`);
    // console.log(`User data : ${req.user.id}`);
    // console.log(`User data : ${req.user.email}`);
    // console.log(`User data : ${req.user.tenantId}`);

    return this.courseService.create(dto, req.user);
  }

  // ================= GET ALL COURSES =================
  @Get()
  async getAll() {
    return this.courseService.getAll();
  }

  // ================= GET COURSE BY COURSE ID =================
  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.courseService.getById(id);
  }

  // ================= UPDATE COURSE BY COURSE ID =================
  @Put(":id")
  async updateById(
    @Param("id") id: string,
    @Body() dto: UpdateCourseDto
  ) {
    return this.courseService.updateById(id, dto);
  }

  // ================= DELETE COURSE BY COURSE ID =================
  @Delete(":id")
  async deleteById(@Param("id") id: string) {
    return this.courseService.deleteById(id);
  }
}
