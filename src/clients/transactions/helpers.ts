import { Bundle, Transaction, TransactionState } from "../../types/models";
import { UpdateTransaction } from "../../repositories/base-repository";
import { ITransactionSubmissionClient } from "./index";
import { GasDetails } from "src/types/evm";
import { AlchemyWeb3 } from "@alch/alchemy-web3";
import { Logger } from "winston";


export const getGasDetails = async (fromAddress: string, transaction: Transaction, alchemy: AlchemyWeb3): Promise<GasDetails> => {
  const gasLimit = await alchemy.eth.estimateGas({
    from: "0x54191b9ebB420462fcaf87CD4dc75BDe6481E0d0",
    to: transaction.to,
    data: transaction.callData,
    value: transaction.value
  })
  const maxPriorityFeePerGas = await alchemy.eth.getMaxPriorityFeePerGas()
  return {
    maxPriorityFee: maxPriorityFeePerGas,
    gasLimit: gasLimit.toString()
  }
}

export type ExecuteBundle = (bundle: Bundle) => Promise<void>

export const executeBundleUninjected = (
  transactionSubmissionClient: ITransactionSubmissionClient,
  updateTransaction: UpdateTransaction,
  logger: Logger
) => async (bundle: Bundle) => {
  let transaction = getReadyTransaction(bundle.transactions);
  if (transaction) {
    logger.info(`Submitting transaction: ${JSON.stringify(transaction)}`, );
    const result = await transactionSubmissionClient.sendTransaction(transaction);
    logger.info(`Transaction result ${JSON.stringify(result)}`);
    transaction = updateTransactionWithResult(transaction, result);
    updateTransaction(transaction);
  }
}

export const getReadyTransaction = (transactions: Array<Transaction>): Transaction | undefined => {
  const transaction = transactions.find(isTransactionReady);
  return transaction;
}

const isTransactionReady = (transaction: Transaction) => {
  return transaction.state == TransactionState.CREATED;
}

const updateTransactionWithResult = (transaction: Transaction, result: any): Transaction => {
  const newTransaction = Object.assign({}, transaction);
  newTransaction.executionId = result?.id || undefined;
  newTransaction.state = TransactionState.SUBMITTED;
  newTransaction.transactionHash = result?.transactionHash || undefined;
  return newTransaction
}