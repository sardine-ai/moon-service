import express from 'express';
// import { BuyClubHouseNFTParams } from '../../types/clubhouse/index';
// import { TransferEvmFundsParams } from '../../types/transfer/index';
// import { BuyNftParams } from '../../types/nft';
// import { validationMw, validateFireblocksSignatureMw } from '../middleware/validation';
// import { 
//   buyGenieNftController, 
//   buyClubHouseNftController, 
//   transferEvmFundsController, 
//   buyNftController,
//   buyNftQuoteController,
//   fireblocksWebhookController
// } from '../controllers';

const router = express.Router();

// router.use('/v1/buy-genie-nft', buyGenieNftController);
// router.use('/v1/buy-club-house-nft', validationMw(BuyClubHouseNFTParams), buyClubHouseNftController);
// router.use('/v1/transfer-funds', validationMw(TransferEvmFundsParams), transferEvmFundsController);
// router.use('/v1/buy-nft', validationMw(BuyNftParams), buyNftController);
// router.use('/v1/quote-buy-nft', validationMw(BuyNftParams), buyNftQuoteController);
// router.use('/v1/fireblocks-webhook', validateFireblocksSignatureMw, fireblocksWebhookController);
// router.use('/v1/get-bundle-status', validateFireblocksSignatureMw, fireblocksWebhookController);

export default router;