import { ExecuteBundle, QuoteBundle } from '../clients/transactions/helpers';
import { GetBundle, StoreBundle } from '../repositories/base-repository';
import { BuildBundle, CommandParams } from '../types/command';
import { Logger } from 'winston';
import { GetBundleStatus } from 'src/types/requests';
import { buildBundleReceiptResponse } from '../types/models/receipt';

export const commandUninjected =
  (
    logger: Logger,
    buildBundle: BuildBundle,
    storeBundle: StoreBundle,
    executeBundle: ExecuteBundle
  ) =>
  async (params: CommandParams) => {
    logger.info(`Processing Order: ${JSON.stringify(params)}`);
    const bundle = await buildBundle(params);
    storeBundle(bundle);
    return await executeBundle(bundle);
  };

export const quoteCommandUninjected =
  (logger: Logger, buildBundle: BuildBundle, quoteBundle: QuoteBundle) =>
  async (params: CommandParams) => {
    logger.info(`Processing Quote: ${JSON.stringify(params)}`);
    const bundle = await buildBundle(params);
    return await quoteBundle(bundle);
  };

export const getBundleStatusUninjected =
  (getBundle: GetBundle) => async (getBundleStatus: GetBundleStatus) => {
    const bundle = await getBundle(getBundleStatus.bundleId);
    if (bundle) {
      const bundleReceipt = buildBundleReceiptResponse(bundle);
      return bundleReceipt;
    }
    throw new Error(`Bundle Id ${getBundleStatus.bundleId} Not Found`);
  };
