import dotenv from 'dotenv';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export interface FireblocksConfig {
  getFireblocksApiSecret: () => Promise<string>
  fireblocksApiKey: string,
  fireblocksSourceVaultAccount: string,
  fireblocksBaseUrl: string,
  vaultAccountId: string
}

const getAccessSecretVersion = async (versionName: string) => {
  const client = new SecretManagerServiceClient();
  const [accessResponse] = await client.accessSecretVersion({
    name: versionName,
  });
  return accessResponse;
}

const getFireblocksApiSecret = async () => {
  const accessResponse = await getAccessSecretVersion(process.env.FIREBLOCKS_API_SECRET_PATH || "")
  const rawFireblocksApiSecret = accessResponse?.payload?.data || "";
  const fireblocksApiSecret = Buffer.from(rawFireblocksApiSecret as string, 'utf-8').toString();
  return fireblocksApiSecret;
}

const getFireblocksConfig = (): FireblocksConfig => {
  return {
    getFireblocksApiSecret: getFireblocksApiSecret,
    fireblocksApiKey: process.env.FIREBLOCKS_API_KEY || "",
    fireblocksSourceVaultAccount: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT || "",
    fireblocksBaseUrl: process.env.FIREBLOCKS_API_BASE_URL || "",
    vaultAccountId: process.env.VAULT_ACCOUNT_ID || ""
  }
}

export default getFireblocksConfig;
