import dotenv from 'dotenv'
dotenv.config()

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

export const config = {
  jwtSecret: getEnv('JWT_SECRET'),
};
