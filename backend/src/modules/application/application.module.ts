import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import {ApplicationService } from './application.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from '../auth/auth.module';   


@Module ({
    imports: [
        DatabaseModule,
        AuthModule,
    ],

    controllers: [ApplicationController],
    providers: [ApplicationService],
})
export class ApplicationModule {}