/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsDefined, ArrayMinSize, IsIn, IsPositive } from "class-validator";
import { Expose } from "class-transformer";
import { IsValidEvmAddress } from "../decorators";

const VALID_ASSET_IDS = ["ETH", "MATIC"]

export class TransferEvmFundsParams {
  @IsDefined()
  @Expose()
  @ArrayMinSize(1, {message: "Please submit at least one transfer order"})
  orders: Array<TransferEvmOrder>
}

class TransferEvmOrder {
  @IsDefined()
  @Expose()
  @IsIn(VALID_ASSET_IDS, {message: `Asset Id must be one of ${VALID_ASSET_IDS.toString()}`})
  assetId: string;

  @Expose()
  @IsValidEvmAddress({message: "Asset contract Address must be a valid EVM Address"})
  assetContractAddress?: string;

  @IsDefined()
  @Expose()
  @IsPositive({message: "Please submit an amoount greater than 0"})
  amountInNativeToken: number

  @IsDefined()
  @Expose()
  @IsValidEvmAddress({message: "To address must be a valid EVM Address"})
  toAddress: string;
}