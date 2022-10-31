import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export interface FireblocksConfig {
  fireblocksApiSecret: string,
  fireblocksApiKey: string,
  fireblocksSourceVaultAccount: string,
  fireblocksBaseUrl: string,
  vaultAccountId: string
}

const getFireblocksConfig = (): FireblocksConfig => {
  return {
    fireblocksApiSecret: process.env.FIREBLOCKS_API_SECRET_PATH || "",
    fireblocksApiKey: process.env.FIREBLOCKS_API_KEY || "",
    fireblocksSourceVaultAccount: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT || "",
    fireblocksBaseUrl: process.env.FIREBLOCKS_API_BASE_URL || "",
    vaultAccountId: process.env.VAULT_ACCOUNT_ID || ""
  }
}

export default getFireblocksConfig;
