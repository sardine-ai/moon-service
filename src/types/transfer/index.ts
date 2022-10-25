/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsDefined, IsIn, IsPositive } from "class-validator";
import { Expose } from "class-transformer";
import { IsValidEvmAddress } from "../decorators";

const VALID_CHAINS = ["ETH", "MATIC"]

export class TransferEvmFundsParams {
  @IsDefined()
  @Expose()
  @IsPositive({message: "Please submit an amoount greater than 0"})
  amountInAsset: number

  @Expose()
  assetSymbol?: string;

  @IsDefined()
  @Expose()
  @IsIn(VALID_CHAINS, {message: `Chain must be one of ${VALID_CHAINS.toString()}`})
  chain: string;

  @IsDefined()
  @Expose()
  @IsValidEvmAddress({message: "To address must be a valid EVM Address"})
  toAddress: string;
}
