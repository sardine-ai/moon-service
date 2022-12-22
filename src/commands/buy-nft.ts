import { IOpenSeaClient } from '../clients/openSea';
import { BuyNftParams } from '../types/requests/nft';
import { createBundle, Bundle, Operation } from '../types/models';
import { configureBundleTransactions } from './utils';

export const buildBuyNftBundleUninjected =
  (opensea: IOpenSeaClient) =>
  async (params: BuyNftParams): Promise<Bundle> => {
    let bundle = createBundle(Operation.BUY_NFT);
    switch (params.platform) {
      case 'opensea': {
        const transaction = await opensea.buildTransaction(params);
        bundle.transactions.push(transaction);
        break;
      }
    }
    bundle = configureBundleTransactions(bundle);
    return bundle;
  };
