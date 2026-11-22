// Environment variables
try {
  process.loadEnvFile(".env");
} catch {}

export const PORT = process.env.PORT || 3000;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const connectionString = process.env.DATABASE_URL;

// Form constraints
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MAX_LENGTH = 18;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LOWER_CASE = 1;
export const PASSWORD_MIN_UPPER_CASE = 1;
export const PASSWORD_MIN_NUMBERS = 1;
export const PASSWORD_MIN_SYMBOLS = 1;

// Server values
export const SALT_LENGTH = 10;
export const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days (unit: ms)
export const SESSION_PRUNE_INTERVAL = 1000 * 60 * 10; // 10 minutes (unit: ms)
