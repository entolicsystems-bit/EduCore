import * as dotenv from "dotenv";
dotenv.config();
require("newrelic");
// import newRelic from 'newrelic';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { PrismaExceptionFilter } from "./exceptions/prisma-exception.filter";
import { AllExceptionFilter } from "./exceptions/all-exception.filter";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { ThrottlerGuard } from "@nestjs/throttler";

// console.log('CRYPTO_SECRET:', process.env.CRYPTO_SECRET);

// console.log('CRYPTO_SECRET:', process.env.CRYPTO_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ["error", "warn", "log"], //hidding debug logs
  });

  // app.setGlobalPrefix('v1');

  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        "http://localhost:3000",
        "http://3.7.212.22:3000",
        "https://d38dmhca7zine6.cloudfront.net",
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // ✅ Global Prisma → HTTP error mapping
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(3000);
}
bootstrap();
