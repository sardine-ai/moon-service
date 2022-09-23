import * as evmCommandService from '../commands/genie.command'
import { bootstrapEnvironment } from './bootstrap';

const environment = bootstrapEnvironment();

export const buyGenieNFT = async (req: any, res: any, next: any) => {
  try {
    res.json(await evmCommandService.buyGenieNFT(req.body, environment));
  } catch (err: any) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}