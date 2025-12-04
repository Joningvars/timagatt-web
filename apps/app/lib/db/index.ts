import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const {
  DATABASE_URL,
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER,
  DB_PASS,
  DB_NAME,
} = process.env;

if (
  !DATABASE_URL &&
  (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME || Number.isNaN(Number(DB_PORT)))
) {
  throw new Error(
    "Database credentials are missing. Set DATABASE_URL or all of DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME.",
  );
}

type GlobalWithDb = typeof globalThis & {
  __dbPool?: mysql.Pool;
  __drizzleDb?: any; // keep loose to avoid type conflicts between mysql2 types
};

const globalForDb = globalThis as GlobalWithDb;

const pool =
  globalForDb.__dbPool ??
  (globalForDb.__dbPool =
  DATABASE_URL != null
    ? mysql.createPool({
        uri: DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60_000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      })
    : mysql.createPool({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60_000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        }));

import * as schema from "./schema";

export const db =
  globalForDb.__drizzleDb ??
  (globalForDb.__drizzleDb = drizzle(pool, { schema, mode: "default" }));

export { pool };
