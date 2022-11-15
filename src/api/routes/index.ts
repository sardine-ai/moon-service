import evmRouter from "./evm";
import express from 'express';
import { receiveFireblocksWebhook } from "../controllers";

const router = express.Router();
router.use('/v1/evm', evmRouter);
router.use('/v1/fireblocks-webhook', receiveFireblocksWebhook);
export default router;