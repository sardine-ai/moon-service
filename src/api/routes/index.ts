import evmRouter from "./evm";
import express from 'express';

const router = express.Router();
router.use('v1/evm', evmRouter);
export default router;