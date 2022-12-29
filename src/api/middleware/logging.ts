/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response, Request, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import Logger from '@/loaders/logger';

export const requestEnrichmentMw = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.body['requestId'] = uuid();
  req.body['timestamp'] = Math.floor(Date.now() / 1000);
  next();
};

export const requestLoggerMw = (req: any, res: any, next: any) => {
  Logger.info('Request', {
    Body: req.body,
    Method: req.method,
    URL: req.url,
    Hostname: req.hostname
  });
  next();
};

export const responseLoggerMw = (_req: any, res: any, next: any) => {
  const send = res.send;
  res.send = (content: any) => {
    Logger.info('Response', { Body: content });
    res.send = send;
    return res.send(content);
  };
  next();
};
