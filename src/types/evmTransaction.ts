import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

export interface EvmTransaction {
  to?: string;
  from?: string;
  nonce?: number;
  gasLimit?: BigNumber;
  gasPrice?: BigNumber; 
  amountEth?: BigNumberish;
  txNote?: string;
  data?: string;
}