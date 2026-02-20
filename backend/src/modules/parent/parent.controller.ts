import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateParentDto } from 'src/dto/create-parent.dto';
import { UpdateParentDto } from 'src/dto/update-parent.dto';
//import { CreateParentDto } from './dto/create-parent.dto';
//import { UpdateParentDto } from './dto/update-parent.dto';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  create(@Body() dto: CreateParentDto) {
    return this.parentService.create(dto);
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