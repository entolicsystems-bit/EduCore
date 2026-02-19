import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { DatabaseModule } from 'src/database/database.module'; // Adjust path based on your project

@Module({
  imports: [DatabaseModule],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService], // Export if other modules (like Student) need it
})
export class BatchesModule {}