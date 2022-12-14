import { Erc20Token } from '../types/evm';

interface AssetDetails {
  [key: string]: {
    [key: string]: Erc20Token;
  };
}

const ASSET_DETAILS: AssetDetails = {
  goerli: {
    ETH: {
      assetContractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    USDC: {
      assetContractAddress: '0x5FfbaC75EFc9547FBc822166feD19B05Cd5890bb',
      decimals: 6
    },
    WETH: {
      assetContractAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      decimals: 18
    },
    UNI: {
      assetContractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      decimals: 18
    }
  },
  mainnet: {
    ETH: {
      assetContractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    USDC: {
      assetContractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6
    },
    WETH: {
      assetContractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18
    }
  },
  polygon_test: {
    MATIC: {
      assetContractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    USDC: {
      assetContractAddress: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
      decimals: 6
    },
    WETH: {
      assetContractAddress: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      decimals: 18
    }
  },
  polygon: {
    MATIC: {
      assetContractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    USDC: {
      assetContractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6
    },
    WETH: {
      assetContractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      decimals: 18
    }
  }
};

export const getAssetDetails = (
  chain: string,
  assetSymbol: string
): Erc20Token => {
  return ASSET_DETAILS[chain][assetSymbol];
};

export const amountToSmallestDenomination = (
  amount: number,
  decimals: number
) => {
  return amount * 10 ** decimals;
};

export const isNativeToken = (assetSymbol: string, chain: string) => {
  return assetSymbol === getNativeToken(chain);
};

export const getNativeToken = (chain: string): string => {
  switch (chain) {
    case 'goerli': {
      return 'ETH';
    }
    case 'mainnet': {
      return 'ETH';
    }
    case 'polygon_test': {
      return 'MATIC';
    }
    case 'polygon': {
      return 'MATIC';
    }
    default: {
      return 'ETH';
    }
  }
};
