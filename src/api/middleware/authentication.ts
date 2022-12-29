import { Response, Request, NextFunction } from 'express';
import { UnauthorizedError } from '@/types/errors';

export const authenticationMw = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const expectedSecret = 'TEMP_API_KEY'; // GET FROM SECRET MANAGER
  const apiKey = req.get('X-API-Key');
  if (apiKey == expectedSecret) {
    next();
  } else {
    const e = new UnauthorizedError();
    next(e);
  }
};
