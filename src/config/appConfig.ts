import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export interface AppConfig {
  port: number,
  logs: object,
  api: object,
}

const getAppConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT || "8000", 10),
    logs: {
      level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
      prefix: '/api',
    }
  }
}

export default getAppConfig;
