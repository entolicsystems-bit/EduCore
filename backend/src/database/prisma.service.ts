// import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
// import { PrismaClient } from "@prisma/client";
// import { ConfigService } from "@nestjs/config";

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor(private readonly config: ConfigService) {
//     super({
//       accelerateUrl: config.get<string>("DATABASE_URL"),
//     });
//     // super();

//   }

//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }


import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
  super({
    datasourceUrl: this.config.get<string>('DATABASE_URL'),
  });
}


  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

