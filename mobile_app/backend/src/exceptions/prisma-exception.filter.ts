import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse();

    // 🔁 Duplicate key (unique constraint)
    if (exception.code === 'P2002') {
      return response.status(409).json({
        statusCode: 409,
        message: 'Phone number already exists',
        error: 'Conflict',
      });
    }

    // Fallback for other Prisma errors
    return response.status(400).json({
      statusCode: 400,
      message: 'Database error',
      error: 'Bad Request',
    });
  }
}
