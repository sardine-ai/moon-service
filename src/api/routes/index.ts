import express from 'express';
import { validationMw, validateFireblocksSignatureMw } from '../middleware/validation';
import { authenticationMw } from '../middleware/authentication';
import { 
  buyGenieNftController, 
  buyClubHouseNftController, 
  transferEvmFundsController, 
  buyNftController,
  buyNftQuoteController,
  fireblocksWebhookController
} from '../controllers';
import {
  BuyClubHouseNFTParams,
  TransferEvmFundsParams,
  BuyNftParams,
  GetBundleStatus
} from "../../types/requests"
import { requestEnrichmentMw, requestLoggerMw } from '../middleware/logging';

const router = express.Router();

router.use(requestEnrichmentMw);
router.use(requestLoggerMw);

// Commands
router.use('/v1/buy-genie-nft', authenticationMw, buyGenieNftController);
router.use('/v1/buy-club-house-nft', authenticationMw, validationMw(BuyClubHouseNFTParams), buyClubHouseNftController);
router.use('/v1/transfer-funds', authenticationMw, validationMw(TransferEvmFundsParams), transferEvmFundsController);
router.use('/v1/buy-nft', authenticationMw, validationMw(BuyNftParams), buyNftController);
router.use('/v1/quote-buy-nft', authenticationMw, validationMw(BuyNftParams), buyNftQuoteController);

// Webhooks 
router.use('/v1/fireblocks-webhook', validateFireblocksSignatureMw, fireblocksWebhookController);

// Get
router.use('/v1/get-bundle-status', authenticationMw, validationMw(GetBundleStatus), fireblocksWebhookController);

export default router;