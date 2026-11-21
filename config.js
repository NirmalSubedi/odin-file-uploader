try {
  process.loadEnvFile(".env");
} catch {}

export const connectionString = process.env.DATABASE_URL;
