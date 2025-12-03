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

export const pool =
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
      });

export const db = drizzle(pool);
