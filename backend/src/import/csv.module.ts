import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { PrismaService } from 'src/database/prisma.service';


@Module({
  controllers: [CsvController],
  providers: [CsvService, PrismaService],
})
export class CsvModule {}
