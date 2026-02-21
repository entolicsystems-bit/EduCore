import { RolesService } from './../roles/roles.service';
import { Module } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { StaffController } from "./staff.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [StaffController],
  providers: [StaffService, PrismaService, RolesService],
})
export class StaffModule {}