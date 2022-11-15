import { BuyClubHouseNFTParams } from '../../types/clubhouse/index';
import { TransferEvmFundsParams } from '../../types/transfer/index';
import { validationMw } from '../middleware/validation';
import express from 'express';
import { buyGenieNftController, buyClubHouseNftController, transferEvmFundsController } from '../controllers';

const evmRouter = express.Router();

evmRouter.post('/buy-genie-nft', buyGenieNftController);
evmRouter.post('/buy-club-house-nft', validationMw(BuyClubHouseNFTParams), buyClubHouseNftController);
evmRouter.post('/transfer-funds', validationMw(TransferEvmFundsParams), transferEvmFundsController);

export default evmRouter;