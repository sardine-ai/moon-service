import { BuyClubHouseNFTParams } from '@/types/requests/clubhouse';
import { ITransactionSubmissionClient } from '@/clients/transactions';
import logger from '@/loaders/logger';

export const buyClubHouseNFTUninjected =
  (
    _transactionSubmissionClient: ITransactionSubmissionClient
  ) =>
  async (_buyClubHouseNFTParams: BuyClubHouseNFTParams) => {
    logger.info('hello world');
  };
