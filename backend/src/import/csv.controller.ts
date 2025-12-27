import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { CsvService } from './csv.service';
import { CreateStudentCsvDto } from 'src/dto/csv-import-dto';

@Controller('v1/csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, 
      fileFilter: (_, file, cb) => {
        if (!file.originalname.endsWith('.csv')) {
          return cb(
            new BadRequestException('Only CSV files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('CSV file is required.');
    }

    const validStudents: CreateStudentCsvDto[] = [];
    const errors: any[] = [];

    const stream = Readable.from(file.buffer);
    let rowNumber = 1; // header row

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          rowNumber++;

          const rowErrors: string[] = [];

          if (!row.email) rowErrors.push('Email is required');
          if (!row.name) rowErrors.push('Name is required');
          if (!row.phone) rowErrors.push('Phone is required');
          if (!row.password) rowErrors.push('Password is required');
          if (!row.role) rowErrors.push('Role is required');

          if (rowErrors.length > 0) {
            errors.push({ row: rowNumber, errors: rowErrors, data: row });
            return;
          }

          const dto = plainToInstance(
            CreateStudentCsvDto,
            {
              email: row.email,
              name: row.name,
              password: row.password,
              phone: row.phone,
              role: row.role.toUpperCase(),
            },
            { enableImplicitConversion: true },
          );

          const validationErrors = validateSync(dto, {
            whitelist: true,
            forbidUnknownValues: false,
          });

          if (validationErrors.length > 0) {
            errors.push({
              row: rowNumber,
              errors: validationErrors
                .map((err) => Object.values(err.constraints ?? {}))
                .flat(),
              data: row,
            });
            return;
          }

          validStudents.push(dto);
        })
        .on('end', () => resolve())
        .on('error', reject);
    });

    const insertedCount = await this.csvService.bulkCreate(validStudents);

    return {
      message: 'CSV processed',
      totalRows: rowNumber - 1,
      imported: insertedCount,
      failed: errors.length,
      errors,
    };
  }
}
