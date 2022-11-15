import { Response, Request } from 'express';
import * as commands from '../../commands/index';
import { receiveFireblocksWebhook as receiveFireblocksWebhookCommand } from '../../commands/fireblocks-webhook'; 
import Logger from '../../loaders/logger';

export const buyGenieNFT = async (req: Request, res: Response) => {
  try {
    res.json(await commands.buyGenieNFT(req.body)).status(200);
  } catch (err: unknown) {
    Logger.error("An Error Occured while processing Buy Genie NFT", err);
    res.status(500);
  }
}

export const buyClubHouseNFT = async (req: Request, res: Response) => {
  try {
    Logger.info("Handling Buy Club House NFT");
    res.json(await commands.buyClubHouseNFT(req.body)).status(200);
  } catch (err: unknown) {
    Logger.error("An Error Occured while processing Buy Club House NFT", err);
    res.status(500);
  }
}

export const transferEvmFunds = async (req: Request, res: Response) => {
  try {
    Logger.info("Handling Transfer Funds");
    res.json(await commands.transferFunds(req.body)).status(200);
  } catch (err: unknown) {
    Logger.error("An Error Occured while processing Handling Transfer Funds", err);
    res.status(500);
  }
}

export const receiveFireblocksWebhook = async (req: Request, res: Response) => {
  try {
    Logger.info("Handling Transfer Funds");
    await receiveFireblocksWebhookCommand(req.body)
    res.send("ok");
  } catch (err: unknown) {
    Logger.error("An Error Occured while processing Handling Transfer Funds", err);
  }
}