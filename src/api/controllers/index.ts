import { Response, Request } from 'express';
import * as commands from '../../commands'
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