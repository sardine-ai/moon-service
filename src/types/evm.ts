export interface EvmTransaction {
  from?: string;
  to?: string;
  gas?: string;
  gasPrice?: string; 
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  data?: string;
  value?: string;
  txNote?: string;
  chainId?: number;
  chain: string;
  assetSymbol: string;
}

export interface Erc20Token {
  assetContractAddress: string;
  decimals: number;
}