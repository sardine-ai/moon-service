import { IOpenSeaClient } from '../clients/openSea';
import { BuyNftParams } from '../types/requests/nft';
import { createBundle, Bundle, Operation } from '../types/models';
import { ITransactionSubmissionClient } from 'src/clients/transactions';

export const buildBuyNftBundleUninjected = (
  opensea: IOpenSeaClient, 
  transactionSubmissionClient: ITransactionSubmissionClient,
) => async (params: BuyNftParams): Promise<Bundle> => {
    let bundle = createBundle(Operation.BUY_NFT);
    switch (params.platform) {
      case 'opensea': {
        const transaction = await opensea.buildTransaction(params);
        bundle.transactions.push(transaction);
        break;
      }
    }
    return bundle;
  };
