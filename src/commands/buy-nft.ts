import { IOpenSeaClient } from '../clients/opensea';
import { BuyNftParams } from '../types/requests/nft';
import { createBundle, Bundle, Operation } from '../types/models';
import { configureBundleTransactions } from './utils';
import { BuildSwapTransaction } from '../clients/swaps';
import { QuoteBundle } from '../clients/transactions/helpers';

export const buildBuyNftBundleUninjected =
  (
    opensea: IOpenSeaClient,
    quotebundle: QuoteBundle,
    buildSwapTransaction: BuildSwapTransaction
  ) =>
  async (params: BuyNftParams): Promise<Bundle> => {
    let bundle = createBundle(Operation.BUY_NFT);
    switch (params.platform) {
      case 'opensea': {
        const transaction = await opensea.buildTransaction(params);
        bundle.transactions.push(transaction);
        break;
      }
    }
    // const bundleQuote = await quotebundle(bundle);
    // const transactions = await buildSwapTransaction(bundleQuote);
    // bundle.transactions = [...transactions].concat(bundle.transactions);
    bundle = configureBundleTransactions(bundle);
    return bundle;
  };
