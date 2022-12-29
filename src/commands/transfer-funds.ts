import { TransferEvmFundsParams } from '@/types/requests';
import { buildEvmTransferTransaction } from '@/clients/evm';
import { createBundle, Bundle, Operation } from '@/types/models';
import { configureBundleTransactions } from './utils';

export const buildTransferFundsBundle = async (
  params: TransferEvmFundsParams
): Promise<Bundle> => {
  let bundle = createBundle(Operation.TRANSFER_FUNDS);
  // TODO: Logic to check if we have the funds?
  // ??
  const transaction = buildEvmTransferTransaction(params);
  bundle.transactions.push(transaction);
  bundle = configureBundleTransactions(bundle);
  return bundle;
};
