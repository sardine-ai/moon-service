import * as evmCommandsController from '../controllers/evmCommands.controler';

const express = require('express');
const router = express.Router();

router.post('/buy-genie-nft', evmCommandsController.buyGenieNFT);

module.exports = router;