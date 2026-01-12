import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    // For direct database connection in CLI commands like migrate and generate
    adapter: "postgresql",              // ✅ specify the database type
    url: process.env.DATABASE_URL,      // ✅ connection string from .env
  },
  migrations: {
    seed: "ts-node prisma/seed.ts",     // optional, if you have seed scripts
  },
});
