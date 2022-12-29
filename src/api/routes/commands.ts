import express from 'express';
import { validationMw } from '../middleware/validation';
import { authenticationMw } from '../middleware/authentication';
import {
  buyGenieNftController,
  buyClubHouseNftController,
  transferEvmFundsController,
  buyNftController,
  buyNftQuoteController,
  swapTokensController,
  swapTokensQuoteController,
  getBundleStatusController
} from '../controllers';
import {
  BuyClubHouseNFTParams,
  TransferEvmFundsParams,
  BuyNftParams,
  GetBundleStatusParams,
  SwapTokensParams
} from '@/types/requests';
import {
  requestEnrichmentMw,
  requestLoggerMw,
  responseLoggerMw
} from '../middleware/logging';

export const router = express.Router();

router.use(
  requestEnrichmentMw,
  requestLoggerMw,
  responseLoggerMw,
  authenticationMw
);

// Commands
router.post('/v1/buy-genie-nft', buyGenieNftController);
router.post(
  '/v1/buy-club-house-nft',
  validationMw(BuyClubHouseNFTParams),
  buyClubHouseNftController
);
router.post(
  '/v1/transfer-funds',
  validationMw(TransferEvmFundsParams),
  transferEvmFundsController
);
router.post('/v1/buy-nft', validationMw(BuyNftParams), buyNftController);
router.get(
  '/v1/quote-buy-nft',
  validationMw(BuyNftParams),
  buyNftQuoteController
);
router.post(
  '/v1/swap-tokens',
  validationMw(SwapTokensParams),
  swapTokensController
);
router.get(
  '/v1/quote-swap-tokens',
  validationMw(SwapTokensParams),
  swapTokensQuoteController
);
// Get
router.get(
  '/v1/get-bundle-status',
  validationMw(GetBundleStatusParams),
  getBundleStatusController
);
