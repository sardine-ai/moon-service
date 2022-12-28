import { ExecuteBundle, QuoteBundle } from '../clients/transactions/helpers';
import { StoreBundle } from '../repositories/base-repository';
import { BuildBundle, CommandParams } from '../types/command';
import { Logger } from 'winston';
import { getBaseRequest } from '../types/requests/base-request';

export const commandUninjected =
  (
    logger: Logger,
    buildBundle: BuildBundle,
    storeBundle: StoreBundle,
    executeBundle: ExecuteBundle
  ) =>
  async (params: CommandParams) => {
    logger.info(`Processing Order: ${JSON.stringify(params)}`, getBaseRequest(params));
    const bundle = await buildBundle(params);
    logger.info(`Bundle: ${JSON.stringify(bundle)}`, getBaseRequest(params));
    storeBundle(bundle);
    return await executeBundle(bundle);
  };

export const quoteCommandUninjected =
  (logger: Logger, buildBundle: BuildBundle, quoteBundle: QuoteBundle) =>
  async (params: CommandParams) => {
    logger.info(`Processing Quote: ${JSON.stringify(params)}`, getBaseRequest(params));
    const bundle = await buildBundle(params);
    logger.info(`Bundle: ${JSON.stringify(bundle)}`, getBaseRequest(params));
    return await quoteBundle(bundle);
  };
