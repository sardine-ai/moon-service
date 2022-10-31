/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import cors from 'cors';
import router from '../api/routes';
import getAppConfig from '../config/app-config';

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
    return res
      .status(404)
      .send({ message: "Not Found" })
      .end();
  });

  /// error handlers
  const unauthorizedErrorHandler: ErrorRequestHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  }
  app.use(unauthorizedErrorHandler);

  const internalServerErrorHandler: ErrorRequestHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  }
  app.use(internalServerErrorHandler);
};