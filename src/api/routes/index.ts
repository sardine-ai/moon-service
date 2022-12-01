import express from 'express';
import { receiveFireblocksWebhook } from "../controllers";
import { BuyClubHouseNFTParams } from '../../types/clubhouse/index';
import { TransferEvmFundsParams } from '../../types/transfer/index';
import { BuyNftParams } from '../../types/nft';
import { validationMw } from '../middleware/validation';
import { 
  buyGenieNftController, 
  buyClubHouseNftController, 
  transferEvmFundsController, 
  buyNftController,
  buyNftQuoteController
} from '../controllers';

const router = express.Router();

router.use('/v1/buy-genie-nft', buyGenieNftController);
router.use('/v1/buy-club-house-nft', validationMw(BuyClubHouseNFTParams), buyClubHouseNftController);
router.use('/v1/transfer-funds', validationMw(TransferEvmFundsParams), transferEvmFundsController);
router.use('/v1/buy-nft', validationMw(BuyNftParams), buyNftController);
router.use('/v1/quote/buy-nft', validationMw(BuyNftParams), buyNftQuoteController);
router.use('/v1/fireblocks-webhook', receiveFireblocksWebhook);

export default router;