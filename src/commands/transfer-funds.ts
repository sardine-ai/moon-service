import { TransferEvmFundsParams } from '../types/requests/transfer';
import { buildEvmTransferTransaction } from '../clients/evm';
import { createBundle, Bundle, Operation } from '../types/models';
import { setStartingTransaction, updateTransactionWithBundleId } from './utils';

export const buildTransferFundsBundle = async (
  params: TransferEvmFundsParams
): Promise<Bundle> => {
  let bundle = createBundle(Operation.TRANSFER_FUNDS);
  // TODO: Logic to check if we have the funds?
  // ??
  let transaction = buildEvmTransferTransaction(params);
  transaction = updateTransactionWithBundleId(transaction, bundle.id);
  bundle.transactions.push(transaction);
  bundle = setStartingTransaction(bundle);
  return bundle;
};
