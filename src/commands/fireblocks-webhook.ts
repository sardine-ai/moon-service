import { update } from "lodash";
import { 
  GetBundleByTransactionExecutionId, 
  UpdateTransaction, 
  GetBundle
} from "../repositories/base-repository";
import { 
  getTransactionState, 
  Transaction, 
  TransactionState
} from "../types/models";
import { 
  buildBundleReceiptResponse
} from "../types/receipt";
import {
  updateTransactionWithCosts
} from "./utils";
import {
  NotifySubscribers
} from "../clients/notifications";
import { FireblocksWebhookResponse } from "../types/fireblocks";

export const handleFireblocksWebhookUninjected = (
  getBundleByTransactionExecutionId: GetBundleByTransactionExecutionId,
  updateTransaction: UpdateTransaction,
  getBundle: GetBundle,
  notifySubscribers: NotifySubscribers
) => async (fireblocksWebhookResponse: FireblocksWebhookResponse) => {
  console.log(fireblocksWebhookResponse);
  const bundle = await getBundleByTransactionExecutionId(fireblocksWebhookResponse.data.id);
  console.log("bundle", bundle);
  if (bundle) {
    const transactionIndex = bundle.transactions.findIndex(transaction => transaction.executionId == fireblocksWebhookResponse.data.id);
    console.log("transactionIndex", transactionIndex);
    if (transactionIndex != -1) {
      let transaction = bundle.transactions[transactionIndex];
      const newState = getTransactionState(fireblocksWebhookResponse.data.status);
      console.log("newState", newState)
      if (transaction?.state != newState && newState != TransactionState.UNDEFINED) {
        transaction = update(transaction, "state", (_s) => newState) as Transaction;
        transaction = update(transaction, "transactionHash", (_h => fireblocksWebhookResponse.data.txHash)) as Transaction;
        console.log("update Transaction", transaction)
        switch (newState) {
          case TransactionState.COMPLETED: {
            transaction = updateTransactionWithCosts(
              transaction,
              fireblocksWebhookResponse.data.amountInfo.netAmount,
              fireblocksWebhookResponse.data.feeInfo.networkFee,
            );
            console.log("complete Transaction", transaction)
            break;
          }
          case TransactionState.FAILED: {
            // Need to figure out what to do here: retry or rollback?
            break;
          }
          case TransactionState.CANCELLED || TransactionState.REJECTED: {
            // Rejected by sardine
            break;
          }
          case TransactionState.BLOCKED: {
            // Rejected by policy
            break;
          }
        }
        updateTransaction(transaction);
        bundle.transactions[transactionIndex] = transaction
        console.log("Bundle", bundle);
        const bundleReceiptResponse = buildBundleReceiptResponse(bundle);
        notifySubscribers(bundleReceiptResponse);
      }
    }
  }
}