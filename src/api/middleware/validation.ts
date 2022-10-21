/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response, Request, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import Logger from "../../loaders/logger";

export const validationMw = (dtoClass: any) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const output: any = plainToInstance(dtoClass, req.body);
    validate(output, { skipMissingProperties: true }).then(errors => {
      // errors is an array of validation errors
      if (errors.length > 0) {
        Logger.error(errors);
        let errorTexts: any = [];
        for (const errorItem of errors) {
            errorTexts = errorTexts.concat(errorItem.constraints);
        }
        res.status(400).send(errorTexts);
        return;
      } else {
        res.locals.input = output;
        next();
      }
    });
  };
};