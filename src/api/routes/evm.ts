import { BuyClubHouseNFTParams } from '../../types/clubhouse/index';
import { TransferEvmFundsParams } from '../../types/transfer/index';
import { validationMw } from '../middleware/validation';
import express from 'express';
import { buyGenieNFT, buyClubHouseNFT, transferEvmFunds } from '../controllers/index';

const evmRouter = express.Router();

evmRouter.post('/buy-genie-nft', ((req, resp) => buyGenieNFT(req, resp)));
evmRouter.post('/buy-club-house-nft', validationMw(BuyClubHouseNFTParams), buyClubHouseNFT);
evmRouter.post('/transfer-funds', validationMw(TransferEvmFundsParams), transferEvmFunds);

export default evmRouter;