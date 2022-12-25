import { IOpenSeaClient } from '../clients/opensea';
import { BuyNftParams } from '../types/requests/nft';
import { createBundle, Bundle, Operation } from '../types/models';

export const buildBuyNftBundleUninjected = (
  opensea: IOpenSeaClient
) => async (params: BuyNftParams): Promise<Bundle> => {
    const bundle = createBundle(Operation.BUY_NFT);
    switch (params.platform) {
      case 'opensea': {
        const transaction = await opensea.buildTransaction(params);
        bundle.transactions.push(transaction);
        break;
      }
    }
    return bundle;
  };
