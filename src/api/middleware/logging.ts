import { RequestHandler } from 'express';
import { v4 as uuid } from 'uuid';
import Logger from '../../loaders/logger';
import { createNamespace } from 'cls-hooked';

const applicationNamespace = createNamespace('MOON_SERVICE_NAMESPACE');

export const attachContext: RequestHandler = (_req, _res, next) => {
  applicationNamespace.run(() => next());
};

export const requestEnrichmentMw: RequestHandler = async (req, _res, next) => {
  const requestId = uuid();
  applicationNamespace.set('REQUEST_ID', requestId);
  req.body['requestId'] = requestId;
  req.body['timestamp'] = Math.floor(Date.now() / 1000);
  next();
};

export const requestLoggerMw: RequestHandler = (req, _res, next) => {
  Logger.info('Request', {
    Body: req.body,
    Method: req.method,
    URL: req.url,
    Hostname: req.hostname
  });
  next();
};

export const responseLoggerMw: RequestHandler = (_req, res, next) => {
  const send = res.send;
  res.send = (content: unknown) => {
    Logger.info('Response', { Body: content });
    res.send = send;
    return res.send(content);
  };
  next();
};
