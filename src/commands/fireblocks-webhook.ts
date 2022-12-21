import { update } from 'lodash';
import {
  GetBundleByTransactionExecutionId,
  UpdateTransaction
} from '../repositories/base-repository';
import {
  getTransactionState,
  Transaction,
  TransactionState
} from '../types/models';
import { buildBundleReceiptResponse } from '../types/models/receipt';
import { updateTransactionWithCosts } from './utils';
import { NotifySubscribers } from '../clients/notifications';
import { FireblocksWebhookResponse } from '../types/fireblocks';

// TODO: Abstarct this uninjected function, we will probably switch to DFNS
// split into:
// - Get Bundle
// - Update Bundle
// - Store Bundle
// - Notify Subscribers
export const handleFireblocksWebhookUninjected =
  (
    getBundleByTransactionExecutionId: GetBundleByTransactionExecutionId,
    updateTransaction: UpdateTransaction,
    notifySubscribers: NotifySubscribers
  ) =>
  async (fireblocksWebhookResponse: FireblocksWebhookResponse) => {
    console.log(fireblocksWebhookResponse);
    const bundle = await getBundleByTransactionExecutionId(
      fireblocksWebhookResponse.data.id
    );
    if (bundle) {
      const transactionIndex = bundle.transactions.findIndex(
        transaction =>
          transaction.executionId == fireblocksWebhookResponse.data.id
      );
      if (transactionIndex != -1) {
        let transaction = bundle.transactions[transactionIndex];
        const newState = getTransactionState(
          fireblocksWebhookResponse.data.status
        );
        if (
          transaction?.state != newState &&
          newState != TransactionState.UNDEFINED
        ) {
          transaction = update(
            transaction,
            'state',
            _s => newState
          ) as Transaction;
          transaction = update(
            transaction,
            'transactionHash',
            _h => fireblocksWebhookResponse.data.txHash
          ) as Transaction;
          switch (newState) {
            case TransactionState.COMPLETED: {
              transaction = updateTransactionWithCosts(
                transaction,
                fireblocksWebhookResponse.data.amountInfo.netAmount,
                fireblocksWebhookResponse.data.feeInfo.networkFee
              );
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
          bundle.transactions[transactionIndex] = transaction;
          const bundleReceiptResponse = buildBundleReceiptResponse(bundle);
          notifySubscribers(bundleReceiptResponse);
        }
      }
    }
  };
