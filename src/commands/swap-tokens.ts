import { SwapTokensParams } from '../types/requests';
import { createBundle, Bundle, Operation, Transaction } from '../types/models';
import { configureBundleTransactions } from './utils';

export const buildSwapTokensBundleUninjected =
  (
    buildSwapTokenTransaction: (
      params: SwapTokensParams
    ) => Promise<Transaction | undefined>
  ) =>
  async (params: SwapTokensParams): Promise<Bundle> => {
    let bundle = createBundle(Operation.SWAP_TOKENS);
    const transaction = await buildSwapTokenTransaction(params);
    if (transaction) {
      bundle.transactions.push(transaction);
      bundle = configureBundleTransactions(bundle);
    }
    return bundle;
  };
