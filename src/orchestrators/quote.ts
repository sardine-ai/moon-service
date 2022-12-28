import { Bundle, Transaction } from '../types/models';
import { ITransactionSubmissionClient } from '../clients/transactions';
import { Logger } from 'winston';
import {
  TransactionReceipt,
  BundleReceiptResponse,
  getBundleReceiptTotalCost
} from '../types/models/receipt';
import { getAlchemyGasDetails, getGasCost } from '../clients/transactions/gas';
import { CryptoConfig } from '../config/crypto-config';
import { getAssetDetails, getNativeToken, isNativeToken } from '../utils/crypto-utils';

export const quoteBundleUninjected =
  (transactionSubmissionClient: ITransactionSubmissionClient, cryptoConfig: CryptoConfig, logger: Logger) =>
  async (bundle: Bundle): Promise<BundleReceiptResponse> => {
    const transactionQuotes = await Promise.all(
      bundle.transactions.map(async (transaction: Transaction) => {
        logger.info(`Quoting transaction: ${JSON.stringify(transaction)}`);
        const fromAddress = await transactionSubmissionClient.getFromAddress(transaction.chain);
        const transactionQuote = await quoteTransaction(fromAddress, transaction, cryptoConfig)
        return transactionQuote;
      })
    );
    logger.info(`Transaction Quotes: ${JSON.stringify(transactionQuotes)}`);
    const totalCosts = getBundleReceiptTotalCost(transactionQuotes);
    logger.info(`Total cost: ${totalCosts}`);
    return {
      totalCosts: totalCosts,
      transactionReceipts: transactionQuotes
    };
  };

export const quoteTransaction = async (fromAddress: string, transaction: Transaction, cryptoConfig: CryptoConfig): Promise<TransactionReceipt> => {
  const gasDetails = await getAlchemyGasDetails(
    fromAddress,
    transaction,
    cryptoConfig
  );
  
  const gasCost = getGasCost(gasDetails);
  const assetCosts = transaction.assetCosts ?? [];
  const value = transaction.value || '0';
  const nativeCostIndex = assetCosts.findIndex(cost =>
    isNativeToken(cost.assetSymbol)
  );
  if (nativeCostIndex == -1) {
    assetCosts.push({
      assetSymbol: getNativeToken(transaction.chain),
      amount: (Number(value) + Number(gasCost)).toString(),
      decimals: getAssetDetails(
        transaction.chain,
        getNativeToken(transaction.chain)
      ).decimals
    });
  } else {
    assetCosts[nativeCostIndex].amount = (
      Number(assetCosts[nativeCostIndex].amount) + Number(gasCost)
    ).toString();
  }
  return {
    assetCosts: assetCosts,
    gasCost: gasCost.toString(),
    chain: transaction.chain,
    operation: transaction.operation
  };
}