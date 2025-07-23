import dotenv from 'dotenv'
dotenv.config()

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

export const env = {
  JWT_SECRET: getEnv('JWT_SECRET'),
  POSTGRES_USER: getEnv('POSTGRES_USER'),
  POSTGRES_PASSWORD: getEnv('POSTGRES_PASSWORD'),
  POSTGRES_DB: getEnv('POSTGRES_DB'),
  CACHE_TIME: getEnv('CACHE_TIME')
};

