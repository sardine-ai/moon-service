import express from 'express';
import {router as webhookRouter} from './webhook';
import {router as commandRouter} from './commands';

const router = express.Router();

router.use(webhookRouter)
router.use(commandRouter)

export default router;
