import { buyGenieNFT, buyClubHouseNFT, transferEvmFunds } from '../controllers';
import { BuyClubHouseNFTParams } from '../../types/clubhouse';
import { TransferEvmFundsParams } from '../../types/transfer';
import { validationMw } from '../middleware/validation';
import express from 'express';

const evmRouter = express.Router();

evmRouter.post('/buy-genie-nft', buyGenieNFT);
evmRouter.post('/buy-club-house-nft', validationMw(BuyClubHouseNFTParams), buyClubHouseNFT);
evmRouter.post('/transfer-funds', validationMw(TransferEvmFundsParams), transferEvmFunds);

export default evmRouter;