import { Bundle, Transaction } from '../types/models';
import { ITransactionSubmissionClient } from '../clients/transactions';
import {
  TransactionReceipt,
  BundleReceiptResponse,
  getBundleReceiptTotalCost
} from '../types/models/receipt';
import { calculateGasCost, GetGasDetails } from '../clients/transactions/gas';
import { CryptoConfig } from '../config/crypto-config';
import logger from '../loaders/logger';

export type QuoteBundle = (bundle: Bundle) => Promise<BundleReceiptResponse>;

export const quoteBundleUninjected =
  (
    transactionSubmissionClient: ITransactionSubmissionClient,
    quoteTransaction: QuoteTransaction
  ) =>
  async (bundle: Bundle): Promise<BundleReceiptResponse> => {
    const transactionQuotes = await Promise.all(
      bundle.transactions.map(async (transaction: Transaction) => {
        logger.info(`Quoting transaction: ${JSON.stringify(transaction)}`);
        const fromAddress = await transactionSubmissionClient.getFromAddress(
          transaction.chain
        );
        const transactionQuote = await quoteTransaction(
          fromAddress,
          transaction
        );
        return transactionQuote;
      })
    );
    logger.info(`Transaction Quotes: ${JSON.stringify(transactionQuotes)}`);
    const totalCosts = getBundleReceiptTotalCost(transactionQuotes);
    logger.info(`Total cost: ${JSON.stringify(totalCosts)}`);
    return {
      totalCosts: totalCosts,
      transactionReceipts: transactionQuotes
    };
  };

export type QuoteTransaction = (
  fromAddress: string,
  transaction: Transaction
) => Promise<TransactionReceipt>;

export const quoteTransactionUninjected =
  (cryptoConfig: CryptoConfig, getGasDetails: GetGasDetails) =>
  async (
    fromAddress: string,
    transaction: Transaction
  ): Promise<TransactionReceipt> => {
    const gasDetails = await getGasDetails(
      fromAddress,
      transaction,
      cryptoConfig
    );
    const gasCost = calculateGasCost(gasDetails);
    const assetCosts = transaction.assetCosts ?? [];
    return {
      assetCosts: assetCosts,
      gasCost: gasCost.toString(),
      chain: transaction.chain,
      operation: transaction.operation
    };
  };
