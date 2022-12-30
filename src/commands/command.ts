import { ExecuteBundle, QuoteBundle } from '../orchestrators';
import { StoreBundle } from '../repositories/base-repository';
import { BuildBundle, CommandParams } from '../types/command';
import { getBaseRequest } from '../types/requests/base-request';
import logger from '../loaders/logger';

export const commandUninjected =
  (
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

export const quoteCommandUninjected = (
  buildBundle: BuildBundle, 
  quoteBundle: QuoteBundle
) =>
  async (params: CommandParams) => {
    logger.info(
      `Processing Quote: ${JSON.stringify(params)}`,
      getBaseRequest(params)
    );
    const bundle = await buildBundle(params);
    logger.info(`Bundle: ${JSON.stringify(bundle)}`, getBaseRequest(params));
    return await quoteBundle(bundle);
  };
