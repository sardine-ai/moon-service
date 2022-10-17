import { buyNFT } from '../controllers';
import { BuyClubHouseNFTParams } from '../../types/clubHouse';
import { validationMw } from '../middleware/validation';
import express from 'express';

const router = express.Router();

router.post('/blockchain-transaction/nft', validationMw(BuyClubHouseNFTParams), buyNFT);
// router.post('/blockchain_transaction/{id}/status', validationMw(BuyClubHouseNFTParams), buyNFT);

export default router;