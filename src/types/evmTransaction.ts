import { BigNumber } from "@ethersproject/bignumber";
import BN from 'bn.js';

export interface EvmTransaction {
  from?: string | number;
  to?: string;
  nonce?: number;
  gas?: string | number | BigNumber;
  gasPrice?: number | string | BN | BigNumber; 
  maxPriorityFeePerGas?: number | string | BN | BigNumber;
  maxFeePerGas?: number | string | BN | BigNumber;
  data?: string;
  value?: number | string | BN | BigNumber;
  txNote?: string;
  chainId?: number;
}