import getAppConfig from '@/config/app-config';
import { BundleReceiptResponse } from '@/types/models/receipt';

export type NotifySubscribers = (
  bundleReceiptResponse: BundleReceiptResponse
) => Promise<void>;

export const notifySubscribers: NotifySubscribers = async (
  bundleReceiptResponse: BundleReceiptResponse
) => {
  const appConfig = getAppConfig();
  console.log('notifying subscribers', appConfig.cryptoBackendUrl);
  await fetch(appConfig.cryptoBackendUrl, {
    method: 'POST',
    body: JSON.stringify(bundleReceiptResponse)
  });
};
