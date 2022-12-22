import { IOpenSeaClient } from '../clients/openSea';
import { BuyNftParams } from '../types/requests/nft';
import { createBundle, Bundle, Operation } from '../types/models';
import { configureBundleTransactions } from './utils';
import { ITransactionSubmissionClient } from 'src/clients/transactions';

export const buildBuyNftBundleUninjected = (
  opensea: IOpenSeaClient, 
  transactionSubmissionClient: ITransactionSubmissionClient,
  liquiditySwapClient: ILiquiditySwapClient
) => async (params: BuyNftParams): Promise<Bundle> => {
    let bundle = createBundle(Operation.BUY_NFT);
    switch (params.platform) {
      case 'opensea': {
        const transaction = await opensea.buildTransaction(params);
        bundle.transactions.push(transaction);
        break;
      }
    }
    const bundleQuote = await transactionSubmissionClient.quoteTransaction(bundle.transactions[0]);
    const transaction = liquiditySwapClient.buildTransaction(bundleQuote);
    bundle.transactions = [transaction].concat(bundle.transactions);
    bundle = configureBundleTransactions(bundle);
    return bundle;
  };
