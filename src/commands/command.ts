import { ExecuteBundle, QuoteBundle } from '../orchestrators';
import { GetBundle, StoreBundle } from '../repositories/base-repository';
import { BuildBundle, CommandParams } from '../types/command';
import { Logger } from 'winston';
import { GetBundleStatusParams } from 'src/types/requests';
import { buildBundleReceiptResponse } from '../types/models/receipt';
import { getBaseRequest } from '../types/requests/base-request';

export const commandUninjected =
  (
    logger: Logger,
    buildBundle: BuildBundle,
    storeBundle: StoreBundle,
    executeBundle: ExecuteBundle
  ) =>
  async (params: CommandParams) => {
    logger.info(
      `Processing Order: ${JSON.stringify(params)}`,
      getBaseRequest(params)
    );
    const bundle = await buildBundle(params);
    logger.info(`Bundle: ${JSON.stringify(bundle)}`, getBaseRequest(params));
    storeBundle(bundle);
    return await executeBundle(bundle);
  };

export const quoteCommandUninjected =
  (logger: Logger, buildBundle: BuildBundle, quoteBundle: QuoteBundle) =>
  async (params: CommandParams) => {
    logger.info(
      `Processing Quote: ${JSON.stringify(params)}`,
      getBaseRequest(params)
    );
    const bundle = await buildBundle(params);
    logger.info(`Bundle: ${JSON.stringify(bundle)}`, getBaseRequest(params));
    return await quoteBundle(bundle);
  };

export const getBundleStatusUninjected =
  (getBundle: GetBundle) => async (getBundleStatus: GetBundleStatusParams) => {
    const bundle = await getBundle(getBundleStatus.bundleId);
    if (bundle) {
      const bundleReceipt = buildBundleReceiptResponse(bundle);
      return bundleReceipt;
    }
    throw new Error(`Bundle Id ${getBundleStatus.bundleId} Not Found`);
  };
