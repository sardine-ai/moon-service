import { OpenSeaClient } from "../clients/openSea"
import { BuyNftParams } from "../types/nft";
import { createBundle, Bundle, Operation } from "../types/models";
import { setStartingTransaction, updateTransactionWithBundleId } from "./utils";

export const buildBuyNftBundleUninjected = (
  opensea: OpenSeaClient
) => async (params: BuyNftParams): Promise<Bundle> => {
  let bundle = createBundle(Operation.BUY_NFT);
  switch (params.platform) {
    case "opensea": {
      let transaction = await opensea.buildTransaction(params);
      console.log("transaction", transaction);
      transaction = updateTransactionWithBundleId(transaction, bundle.id);
      bundle.transactions.push(transaction);
      break;
    }
  }
  bundle = setStartingTransaction(bundle);
  return bundle;
}