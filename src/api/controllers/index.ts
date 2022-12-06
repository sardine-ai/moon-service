/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response, Request } from 'express';
import * as commands from '../../commands/index';
import Logger from '../../loaders/logger';
import { CommandParams } from '../../types/command';

const commandTryCatchWrapper = (
  command: (command: CommandParams) => Promise<any>
) => async (req: Request, res: Response) => {
  try {
    res.json(await command(req.body)).status(200);
  } catch (err: unknown) {
    Logger.error("An Error Occured while processing request", err);
    res.send(`An Error Occured while processing request: ${err}`).status(500);
  }
}

export const buyGenieNftController = commandTryCatchWrapper(commands.buyGenieNFT);
export const buyClubHouseNftController = commandTryCatchWrapper(commands.buyClubHouseNFT);
export const transferEvmFundsController = commandTryCatchWrapper(commands.transferFunds);
export const transferEvmFundsQuoteController = commandTryCatchWrapper(commands.quoteTransferFunds);
export const buyNftController = commandTryCatchWrapper(commands.buyNft);
export const buyNftQuoteController = commandTryCatchWrapper(commands.quoteBuyNft);
export const fireblocksWebhookController = commandTryCatchWrapper(commands.handleFireblocksWebhook);