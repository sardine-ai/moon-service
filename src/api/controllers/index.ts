import { Response, Request } from 'express';
import * as commands from '../../commands/index';
import { receiveFireblocksWebhook as receiveFireblocksWebhookCommand } from '../../commands/fireblocks-webhook'; 
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
export const buyNftController = commandTryCatchWrapper(commands.buyNft);

export const receiveFireblocksWebhook = async (req: Request, res: Response) => {
  try {
    Logger.info("Handling Transfer Funds");
    await receiveFireblocksWebhookCommand(req.body)
    res.send("ok");
  } catch (err: unknown) {
    Logger.error("An Error Occured while processing Handling Transfer Funds", err);
  }
}