/* eslint-disable @typescript-eslint/no-unused-vars */

import { BaseRequest } from './base-request';
import { IsDefined, IsIn } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsValidEvmAddress } from './decorators';

const VALID_CHAINS = ['goerli', 'mainnet'];
const VALID_PLATFORM = ['opensea'];

export class BuyNftParams extends BaseRequest {
  @IsDefined()
  @Expose()
  nftId: string;

  @Expose()
  @IsDefined()
  collectionName: string;

  @Expose()
  @IsValidEvmAddress({
    message: 'Contract address must be a valid EVM Address'
  })
  contractAddress: string;

  @IsDefined()
  @Expose()
  @IsIn(VALID_CHAINS, {
    message: `Chain must be one of ${VALID_CHAINS.toString()}`
  })
  chain: string;

  @IsDefined()
  @Expose()
  @IsValidEvmAddress({
    message: 'RecipientAddress address must be a valid EVM Address'
  })
  recipientAddress: string;

  @IsDefined()
  @Expose()
  @IsIn(VALID_PLATFORM, {
    message: `Platform must be one of ${VALID_PLATFORM.toString()}`
  })
  platform: string;

  @Expose()
  callData?: string;
}
