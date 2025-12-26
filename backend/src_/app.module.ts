import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,       // 🔴 REQUIRED
      envFilePath: '.env',  // root .env
    }),
    DatabaseModule,
    AuthModule,
    LeadsModule,
  ],
})
export class AppModule {}
