import { Controller, Post, Get, Body, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from 'src/dto/create-batch.dto';

@Controller('v1/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  async create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchesService.createBatch(createBatchDto);
  }

  @Get()
  async findAll() {
    return this.batchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.getBatchDetails(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.removeBatch(id);
  }
}