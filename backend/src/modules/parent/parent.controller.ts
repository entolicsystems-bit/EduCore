import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateParentDto } from 'src/dto/create-parent.dto';
import { UpdateParentDto } from 'src/dto/update-parent.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
//import { CreateParentDto } from './dto/create-parent.dto';
//import { UpdateParentDto } from './dto/update-parent.dto';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  create(@Body() dto: CreateParentDto,@Req() req) {
    console.log(`user data ${req.user}`);
    return this.parentService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.parentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateParentDto) {
    return this.parentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentService.remove(id);
  }

  @Get(':id/students')
  getStudents(@Param('id') id: string) {
    return this.parentService.getStudentsByParent(id);
  }
}