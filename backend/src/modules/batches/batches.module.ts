import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { DatabaseModule } from 'src/database/database.module'; 

@Module({
  imports: [DatabaseModule],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService], 
})
export class BatchesModule {}