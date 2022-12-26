import express from 'express';
import { validateFireblocksSignatureMw } from '../middleware/validation';
import { requestLoggerMw } from '../middleware/logging';
import { fireblocksWebhookController } from '../controllers';

export const router = express.Router();

// Webhooks
router.use(
  '/v1/fireblocks-webhook',
  requestLoggerMw,
  validateFireblocksSignatureMw,
  fireblocksWebhookController
);
