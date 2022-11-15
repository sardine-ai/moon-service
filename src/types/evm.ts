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
  nonce: number;
}

export interface Erc20Token {
  assetContractAddress: string;
  decimals: number;
}

export interface GasDetails {
  maxFee?: string;
  maxPriorityFee?: string;
  gasPrice?: string;
  gasLimit?: string;
}

export interface PolgyonGasDetails {
  safeLow: {
    maxPriorityFee: number,
    maxFee: number
  },
  standard: {
    maxPriorityFee: number,
    maxFee: number
  },
  fast: {
    maxPriorityFee: number,
    maxFee: number
  },
  estimatedBaseFee: number,
  blockTime: number,
  blockNumber: number
}

export interface EthGasDetails {
  fast: number,
  fastest: number,
  safeLow: number,
  average: number
}