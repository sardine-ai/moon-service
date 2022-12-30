/* eslint-disable @typescript-eslint/no-unused-vars */

import { BaseRequest } from './base-request';
import { IsDefined, IsIn, IsPositive } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsValidEvmAddress } from './decorators';

const VALID_CHAINS = ['mainnet', 'goerli'];
const VALID_TOKENS = ['ETH', 'USDC', 'WETH', 'UNI'];

export class SwapTokensParams extends BaseRequest {
  @IsDefined()
  @Expose()
  @IsIn(VALID_TOKENS, {
    message: `Sell Token must be one of ${VALID_TOKENS.toString()}`
  })
  sellToken: string;

  @IsDefined()
  @Expose()
  @IsIn(VALID_TOKENS, {
    message: `Buy Token must be one of ${VALID_TOKENS.toString()}`
  })
  buyToken: string;

  @IsDefined()
  @Expose()
  @IsPositive({ message: 'Please submit an amoount greater than 0' })
  buyAmount: number;

  @IsDefined()
  @Expose()
  @IsIn(VALID_CHAINS, {
    message: `Chain must be one of ${VALID_CHAINS.toString()}`
  })
  chain: string;

  @Expose()
  @IsValidEvmAddress({ message: 'Taker address must be a valid EVM Address' })
  takerAddress?: string;
}
