/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(backendDir, ".env") });

export default defineConfig({
  schema: path.resolve(backendDir, "src/db/schema.ts"),
  out: path.resolve(backendDir, "drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
