import { 
  Controller, Post, Get, Body, Param, 
  ParseUUIDPipe, Delete, UseGuards, Req
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from 'src/dto/create-batch.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'; 
import { RolesGuard } from 'src/guards/roles.guard';       
import { Roles } from 'src/common/decorator/roles.decorator';    

@Controller('v1/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Only Admin can access
  async create(@Body() createBatchDto: CreateBatchDto, @Req() req: any) {
    // Automatically use tenantId and branchId from the logged-in Admin's token
    const user = req.user; 
    return this.batchesService.createBatch(createBatchDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Any logged-in user can view
  async findAll() {
    return this.batchesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.getBatchDetails(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Only Admin can delete
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.removeBatch(id);
  }
}