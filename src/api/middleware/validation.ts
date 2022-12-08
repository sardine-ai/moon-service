// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Response, Request, NextFunction } from "express";
// import { validate } from "class-validator";
// import { plainToInstance } from "class-transformer";
// import Logger from "../../loaders/logger";
// import crypto from "crypto";

// const FIREBLOCKS_WEBHOOK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0+6wd9OJQpK60ZI7qnZG
// jjQ0wNFUHfRv85Tdyek8+ahlg1Ph8uhwl4N6DZw5LwLXhNjzAbQ8LGPxt36RUZl5
// YlxTru0jZNKx5lslR+H4i936A4pKBjgiMmSkVwXD9HcfKHTp70GQ812+J0Fvti/v
// 4nrrUpc011Wo4F6omt1QcYsi4GTI5OsEbeKQ24BtUd6Z1Nm/EP7PfPxeb4CP8KOH
// clM8K7OwBUfWrip8Ptljjz9BNOZUF94iyjJ/BIzGJjyCntho64ehpUYP8UJykLVd
// CGcu7sVYWnknf1ZGLuqqZQt4qt7cUUhFGielssZP9N9x7wzaAIFcT3yQ+ELDu1SZ
// dE4lZsf2uMyfj58V8GDOLLE233+LRsRbJ083x+e2mW5BdAGtGgQBusFfnmv5Bxqd
// HgS55hsna5725/44tvxll261TgQvjGrTxwe7e5Ia3d2Syc+e89mXQaI/+cZnylNP
// SwCCvx8mOM847T0XkVRX3ZrwXtHIA25uKsPJzUtksDnAowB91j7RJkjXxJcz3Vh1
// 4k182UFOTPRW9jzdWNSyWQGl/vpe9oQ4c2Ly15+/toBo4YXJeDdDnZ5c/O+KKadc
// IMPBpnPrH/0O97uMPuED+nI6ISGOTMLZo35xJ96gPBwyG5s2QxIkKPXIrhgcgUnk
// tSM7QYNhlftT4/yVvYnk0YcCAwEAAQ==
// -----END PUBLIC KEY-----`.replace(/\\n/g, "\n");

// export const validationMw = (dtoClass: any) => {
//   return function (req: Request, res: Response, next: NextFunction) {
//     const output: any = plainToInstance(dtoClass, req.body);
//     validate(output, { skipMissingProperties: true }).then(errors => {
//       // errors is an array of validation errors
//       if (errors.length > 0) {
//         Logger.error(errors);
//         let errorTexts: any = [];
//         for (const errorItem of errors) {
//             errorTexts = errorTexts.concat(errorItem.constraints);
//         }
//         res.status(400).send(errorTexts);
//         return;
//       } else {
//         res.locals.input = output;
//         next();
//       }
//     });
//   };
// };

// export const validateFireblocksSignatureMw = async (req: Request, res: Response, next: NextFunction) => {
//   const message = JSON.stringify(req.body);
//   const signature = req.get("Fireblocks-Signature");
//   if (signature) {
//     const verifier = crypto.createVerify('RSA-SHA512');
//     verifier.write(message);
//     verifier.end();
//     const isVerified = verifier.verify(FIREBLOCKS_WEBHOOK_PUBLIC_KEY, signature, "base64");
//     if (isVerified) {
//       next();
//     }
//   }
//   res.send("ok");
// }