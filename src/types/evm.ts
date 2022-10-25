export interface EvmTransaction {
  from?: string;
  to?: string;
  nonce?: number;
  gas?: string;
  gasPrice?: string; 
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  data?: string;
  value?: string;
  txNote?: string;
  chainId?: number;
}

export interface Erc20Token {
  assetContractAddress: string;
  decimals: number;
}