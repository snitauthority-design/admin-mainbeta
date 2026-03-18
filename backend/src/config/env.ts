import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB_NAME: z.string().min(1, 'MONGODB_DB_NAME is required'),
  ALLOWED_ORIGINS: z.string().optional().default(''),
  JWT_SECRET: z.string().optional().default('your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: z.string().optional().default('7d'),
  UPLOAD_DIR: z.string().optional().default(''),
  PRIMARY_DOMAIN: z.string().optional().default(''),
  /** URL of the Admin Dashboard (e.g. https://admin.myapp.com) */
  ADMIN_URL: z.string().optional().default(''),
  /** URL of the Storefront app (e.g. https://store.myapp.com) */
  STOREFRONT_URL: z.string().optional().default(''),
  /** Shared cookie domain for cross-app auth (e.g. .myapp.com) */
  COOKIE_DOMAIN: z.string().optional().default(''),
  /** Shared uploads directory used by both apps (Docker shared volume) */
  SHARED_UPLOADS_DIR: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[backend] Invalid environment configuration:', parsed.error.format());
  process.exit(1);
}

export const env = {
  port: parsed.data.PORT,
  mongoUri: parsed.data.MONGODB_URI,
  mongoDbName: parsed.data.MONGODB_DB_NAME,
  allowedOrigins: parsed.data.ALLOWED_ORIGINS
    ? parsed.data.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [],
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  uploadDir: parsed.data.UPLOAD_DIR || '',
  primaryDomain: parsed.data.PRIMARY_DOMAIN || '',
  adminUrl: parsed.data.ADMIN_URL || '',
  storefrontUrl: parsed.data.STOREFRONT_URL || '',
  cookieDomain: parsed.data.COOKIE_DOMAIN || '',
  sharedUploadsDir: parsed.data.SHARED_UPLOADS_DIR || '',
};
