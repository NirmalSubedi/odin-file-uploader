import { defineConfig } from "prisma/config";
import { connectionString } from "./config.js";

export default defineConfig({
  schema: "./db/schema.prisma",
  migrations: {
    path: "./db/migrations",
  },
  datasource: {
    url: connectionString,
  },
});
