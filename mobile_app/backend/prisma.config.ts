/// <reference types="node" />
import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    // CLI commands must use a direct database connection
    url: process.env.DIRECT_DATABASE_URL,
  },
  migrations: {
    seed: "ts-node prisma/seed.ts",
  },
});
