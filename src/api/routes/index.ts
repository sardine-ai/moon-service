import { buyGenieNFT, buyClubHouseNFT } from '../controllers';
import { BuyClubHouseNFTParams } from '../../types/clubHouse';
import { validationMw } from '../middleware/validation';
import express from 'express';

const router = express.Router();

router.post('/buy-genie-nft', buyGenieNFT);
router.post('/buy-club-house-nft', validationMw(BuyClubHouseNFTParams), buyClubHouseNFT);

export default router;