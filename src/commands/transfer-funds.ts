import { TransferEvmFundsParams } from "../types/transfer";
import { ExecuteBundle } from "../clients/transactions/helpers";
import { buildEvmTransferTransaction } from "../clients/evm";
import winston from "winston";
import { createBundle, Bundle, BundleOperations } from "../types/models";
import { StoreBundle } from "../repositories/base-repository"
import { setStartingTransaction, updateTransactionWithBundleId } from "./utils";


export const transferFundsUninjected = (
  logger: winston.Logger,
  storeBundle: StoreBundle,
  executeBundle: ExecuteBundle,
) => async (transferEvmFundsParams: TransferEvmFundsParams) => {
  logger.info(`Processing Order: ${JSON.stringify(transferEvmFundsParams)}`)
  const bundle = buildTransferFundsBundle(transferEvmFundsParams);
  await storeBundle(bundle);
  return await executeBundle(bundle);
}

const buildTransferFundsBundle = (transferEvmFundsParams: TransferEvmFundsParams): Bundle => {
  let bundle = createBundle(BundleOperations.TRANSFER_FUNDS);
  // TODO: Logic to check if we have the funds?
  // ??
  let transaction = buildEvmTransferTransaction(transferEvmFundsParams);
  transaction = updateTransactionWithBundleId(transaction, bundle.id);
  bundle.transactions.push(transaction);
  bundle = setStartingTransaction(bundle);
  return bundle;
}
