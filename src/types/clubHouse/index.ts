/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsDefined, IsIn, Min } from "class-validator";
import { Expose } from "class-transformer";
import { IsValidEvmAddress } from "../decorators";

const VALID_ASSET_IDS = ["MATIC"]

export class BuyClubHouseNFTParams {
  @IsDefined()
  @Expose()
  @IsIn(VALID_ASSET_IDS, {message: `Asset Id must be one of ${VALID_ASSET_IDS.toString()}`})
  assetId: string;

  @IsDefined()
  @Expose()
  @Min(0, {message: "NFT Id must be greater than 0"})
  nftId: string;

  @IsDefined()
  @Expose()
  collectionName: string;

  @IsDefined()
  @Expose()
  @IsValidEvmAddress({message: "Contract Address must be a valid EVM Address"})
  contractAddress: string;

  @IsDefined()
  @Expose()
  @IsValidEvmAddress({message: "Recepient Address must be a valid EVM Address"})
  recepientAddress: string;
}