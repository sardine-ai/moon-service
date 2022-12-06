import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  console.log("⚠️  Couldn't find .env file  ⚠️ (Using pure environment variables instead)");
}

export interface AppConfig {
  port: number,
  logs: {
    level: string
  },
  api: {
    prefix: string
  },
  cryptoBackendUrl: string
}

const getAppConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.NODE_PORT || "8000", 10),
    logs: {
      level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
      prefix: '/api',
    },
    cryptoBackendUrl: process.env.CRYPTO_BACKEND_URL || ""
  }
}

export default getAppConfig;
