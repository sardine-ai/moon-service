/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response, Request, NextFunction } from 'express';
import Logger from '../../loaders/logger';
import { CommandParams } from '../../types/command';
import {
  buyGenieNFT,
  buyClubHouseNFT,
  transferFunds,
  quoteTransferFunds,
  buyNft,
  quoteBuyNft,
  handleFireblocksWebhook,
  getBundleStatus
} from '../../commands';
import { functionCounterWrapper } from '../../utils/metrics';

const commandTryCatchWrapper =
  (command: (command: CommandParams) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await command(req.body)).status(200);
    } catch (err: unknown) {
      Logger.error('An Error Occured while processing request', err);
      next(err);
    }
  };

export const buyGenieNftController = commandTryCatchWrapper(buyGenieNFT);
export const buyClubHouseNftController =
  commandTryCatchWrapper(buyClubHouseNFT);
export const transferEvmFundsController = commandTryCatchWrapper(transferFunds);
export const transferEvmFundsQuoteController =
  commandTryCatchWrapper(quoteTransferFunds);
export const buyNftController = commandTryCatchWrapper(
  functionCounterWrapper(buyNft, 'buyNft.calls')
);
export const buyNftQuoteController = commandTryCatchWrapper(
  functionCounterWrapper(quoteBuyNft, 'quoteBuyNft.calls')
);
export const fireblocksWebhookController = commandTryCatchWrapper(
  handleFireblocksWebhook
);
export const getBundleStatusController = commandTryCatchWrapper(
  functionCounterWrapper(getBundleStatus, 'getBundleStatus.call')
);
