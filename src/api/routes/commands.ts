import express from 'express';
import {
  validationMw
} from '../middleware/validation';
import { authenticationMw } from '../middleware/authentication';
import {
  buyGenieNftController,
  buyClubHouseNftController,
  transferEvmFundsController,
  buyNftController,
  buyNftQuoteController,
  getBundleStatusController
} from '../controllers';
import {
  BuyClubHouseNFTParams,
  TransferEvmFundsParams,
  BuyNftParams,
  GetBundleStatus
} from '../../types/requests';
import { requestEnrichmentMw, requestLoggerMw, responseLoggerMw } from '../middleware/logging';

export const router = express.Router();

router.use(
  requestEnrichmentMw, 
  requestLoggerMw, 
  responseLoggerMw
);

// Commands
router.post('/v1/buy-genie-nft', authenticationMw, buyGenieNftController);
router.post(
  '/v1/buy-club-house-nft',
  authenticationMw,
  validationMw(BuyClubHouseNFTParams),
  buyClubHouseNftController
);
router.post(
  '/v1/transfer-funds',
  authenticationMw,
  validationMw(TransferEvmFundsParams),
  transferEvmFundsController
);
router.post(
  '/v1/buy-nft',
  authenticationMw,
  validationMw(BuyNftParams),
  buyNftController
);
router.get(
  '/v1/quote-buy-nft',
  authenticationMw,
  validationMw(BuyNftParams),
  buyNftQuoteController
);

// Get
router.get(
  '/v1/get-bundle-status',
  authenticationMw,
  validationMw(GetBundleStatus),
  getBundleStatusController
);
