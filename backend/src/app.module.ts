import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CsvModule } from "./import/csv.module";
import { winstonOpions } from "./logs/winston.options";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { AuditContextMiddleware } from "./middleware/audit-context";
import { WinstonModule } from "nest-winston";
import { AuditLogModule } from "./logs/audit-log.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔴 REQUIRED
      envFilePath: ".env", // root .env
    }),
    DatabaseModule,
    AuthModule,
    LeadsModule,
    CsvModule,
    AuditLogModule,
    WinstonModule.forRoot(winstonOpions),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer.apply(AuditContextMiddleware).forRoutes("*");
  }
}
