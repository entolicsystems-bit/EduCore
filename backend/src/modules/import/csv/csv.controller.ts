import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Readable } from "stream";
import * as csvParser from "csv-parser";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { CsvService } from "./csv.service";
import { CreateStudentCsvDto } from "src/dto/csv-import-dto";
import { Roles } from "src/common/decorator/roles.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";

const BATCH_SIZE = 1000;

@Controller("v1/csv")
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "COUNSELLOR")
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
    }),
  )
  @Post("import")
  async importCsv(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) throw new BadRequestException("CSV file is required");

    const rows: CreateStudentCsvDto[] = [];
    const errors: any[] = [];
    let rowNumber = 1;

    await new Promise<void>((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csvParser())
        .on("data", (row) => {
          rowNumber++;

          const dto = plainToInstance(CreateStudentCsvDto, {
            email: row.email,
            name: row.name,
            phone: row.phone,
            source: "CSV Import",
            status: "NEW",
          });

          const validationErrors = validateSync(dto);
          if (validationErrors.length) {
            errors.push({ row: rowNumber, errors: validationErrors });
            return;
          }

          rows.push(dto);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const result = await this.csvService.bulkCreate(batch, req.user);

      imported += result.insertedCount;
      skipped += result.skippedCount;
    }

    return {
      message: "CSV processed successfully",
      totalRows: imported+skipped+errors.length,
      imported,
      skipped,
      failed: errors.length,
      errors,
    };
  }
}
