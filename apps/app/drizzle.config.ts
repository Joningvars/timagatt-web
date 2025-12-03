import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
} = process.env;

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    ...(DATABASE_URL
      ? { url: DATABASE_URL }
      : {
          host: DB_HOST!,
          port: Number(DB_PORT ?? "3306"),
          user: DB_USER!,
          password: DB_PASS!,
          database: DB_NAME!,
        }),
  },
});


