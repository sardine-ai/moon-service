/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Sentry from '@sentry/node';
// we want to init Sentry here so we can catch issue from other import
Sentry.init({
  dsn: 'https://edec36bd8c4e41fda354a6b3cc146d38@o1035526.ingest.sentry.io/4504409369411584'
});

import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler
} from 'express';
import cors from 'cors';
import router from '../api/routes/index';
import getAppConfig from '../config/app-config';
import { dogstatsd } from '../utils/metrics';
import logger from '../loaders/logger';

export default async ({ app }: { app: express.Application }) => {
  const appConfig = getAppConfig();

  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  app.use(appConfig.api.prefix, router);

  /// catch 404 and forward to error handler
  app.use((_req: Request, res: Response, _next: NextFunction) => {
    return res.status(404).send({ message: 'Not Found' }).end();
  });

  const errorHandler: ErrorRequestHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    Sentry.captureException(err);
    dogstatsd.increment(err.message);
    logger.error(
      `Error: ${err.message} \nStack Trace: ${
        err?.cause?.stack.split('\n') ?? err?.stack.split('\n') ?? ''
      }`
    );
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message
      }
    });
  };
  app.use(errorHandler);
};
