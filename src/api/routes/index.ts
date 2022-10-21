import evmRouter from "./evm";
import express from 'express';

const router = express.Router();
router.use('/evm', evmRouter);
export default router;