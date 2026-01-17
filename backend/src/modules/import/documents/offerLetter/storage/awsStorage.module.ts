import { Module } from "@nestjs/common";
import { StorageService } from "./awsStorage.service";

@Module({
  controllers: [],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}