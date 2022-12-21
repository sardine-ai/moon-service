/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response, Request, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

export const requestEnrichmentMw = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.body['requestId'] = uuid();
  req.body['timestamp'] = Math.floor(Date.now() / 1000);
  next();
};

// const resDotSendInterceptor = (res: any, send: any) => (content: any) => {
//   res.contentBody = content;
//   res.send = send;
//   res.send(content);
// };

export const requestLoggerMw = (req: any, res: any, next: any) => {
  console.log('Request', req.method, req.url, req.hostname, req.body);
  // res.send = resDotSendInterceptor(res, res.send);
  // res.on("finish", () => {
  //     console.log("Response", res.contentBody);
  // });
  next();
};
