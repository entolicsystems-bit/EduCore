import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Readable } from "stream";
import * as csvParser from "csv-parser";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { CsvService } from "./csv.service";
import { CreateStudentCsvDto } from "src/dto/csv-import-dto";

const BATCH_SIZE = 1000;

@Controller("v1/csv")
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post("import")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
      fileFilter: (_, file, cb) => {
        const name = file.originalname?.toLowerCase()?.trim();
        if (!name || !name.endsWith(".csv")) {
          return cb(null, false);
        }
        cb(null, true);
      },
    })
  )
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("CSV file is required");
    }

    const errors: any[] = [];
    let batch: CreateStudentCsvDto[] = [];
    let rowNumber = 1;
    let importedCount = 0;
    let skippedCount = 0;

    const stream = Readable.from(file.buffer);

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on("data", async (row) => {
          stream.pause();
          rowNumber++;

          const rowErrors: string[] = [];

          if (!row.email) rowErrors.push("Email is required");
          if (!row.name) rowErrors.push("Name is required");
          if (!row.phone) rowErrors.push("Phone is required");

          if (rowErrors.length) {
            errors.push({ row: rowNumber, errors: rowErrors, data: row });
            stream.resume();
            return;
          }

          const dto = plainToInstance(
            CreateStudentCsvDto,
            {
              email: row.email,
              name: row.name,
              phone: row.phone,
              source: "CSV Import",
              status: "NEW",
            },
            { enableImplicitConversion: true }
          );

          const validationErrors = validateSync(dto, { whitelist: true });

          if (validationErrors.length) {
            errors.push({
              row: rowNumber,
              errors: validationErrors
                .map((e) => Object.values(e.constraints ?? {}))
                .flat(),
              data: row,
            });
            stream.resume();
            return;
          }

          batch.push(dto);

          if (batch.length === BATCH_SIZE) {
            const result = await this.csvService.bulkCreate(batch);
            importedCount += result.insertedCount;
            skippedCount += result.skippedCount;

            // Add skipped rows to errors
            errors.push(
              ...result.skippedData.map((d) => ({
                row: rowNumber,
                data: d,
                errors: ["Duplicate email or phone number"],
              }))
            );

            batch = [];
          }

          stream.resume();
        })
        .on("end", async () => {
          if (batch.length) {
            const result = await this.csvService.bulkCreate(batch);
            importedCount += result.insertedCount;
            skippedCount += result.skippedCount;

            errors.push(
              ...result.skippedData.map((d) => ({
                row: rowNumber,
                data: d,
                errors: ["Duplicate email or phone number"],
              }))
            );
          }
          resolve();
        })
        .on("error", reject);
    });

    return {
      message: "CSV processed successfully",
      totalRows: rowNumber - 1,
      imported: importedCount,
      skipped: skippedCount,
      failed: errors.length,
      errors,
    };
  }
}
