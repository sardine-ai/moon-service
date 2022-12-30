import { CryptoConfig } from '../../config/crypto-config';

export const getChainAlchemy = (chain: string, cryptoConfig: CryptoConfig) => {
  switch (chain) {
    case cryptoConfig.ethChain: {
      return cryptoConfig.ethWeb3!;
    }
    case cryptoConfig.polygonChain: {
      return cryptoConfig.polygonWeb3!;
    }
    default: {
      throw new Error('No alchemy web3 supported for this chain');
    }
  }
};
