import { NotificationModule } from "./modules/notifications/notification.module";
import { ApplicationModule } from "./modules/application/application.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CsvModule } from "./modules/import/csv/csv.module";
import { winstonOpions } from "./modules/logs/winston.options";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { AuditContextMiddleware } from "./middleware/audit-context";
import { WinstonModule } from "nest-winston";
import { AuditLogModule } from "./modules/logs/audit-log.module";
import { RolesModule } from "./modules/roles/roles.module";
import { documentModule } from "./modules/import/documents/upload/document.module";
import { verifyDocumentModule } from "./modules/import/documents/verify/document-verify.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { StorageModule } from "./modules/import/documents/offerLetter/storage/awsStorage.module";
import { StudentModule } from "./modules/student/student.module";
import { OfferLetterModule } from "./modules/import/documents/offerLetter/offer-letter.module";
import { CourseModule } from "./modules/course/course.module";
import { ParentModule } from "./modules/parent/parent.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       name: "default",
    //       ttl: seconds(60),
    //       limit: 10,
    //     },
    //   ],
    //   errorMessage: "Too many request! Please wait a minute and try again!",
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "public"),
    }),
    EventEmitterModule.forRoot({ wildcard: true, verboseMemoryLeak: true }),
    DatabaseModule,
    StorageModule,

    /* ✅ ADDED */
    NotificationModule,

    AuthModule,
    LeadsModule,
    StudentModule,
    CsvModule,
    documentModule,
    AuditLogModule,
    RolesModule,
    WinstonModule.forRoot(winstonOpions),
    ApplicationModule,
    OfferLetterModule,
    verifyDocumentModule,
    CourseModule,
    ParentModule,
  ],

  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: ThrottlerGuard,
  //   },
  // ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer.apply(AuditContextMiddleware).forRoutes("*");
  }
}
