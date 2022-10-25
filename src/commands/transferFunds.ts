import { TransferEvmFundsParams } from "src/types/transfer";
import { ITransactionSubmissionClient } from "../clients/transactions";
import { Erc20 } from "src/clients/evm";
import { EvmTransaction } from "src/types/evm";
import { CryptoConfig } from "src/config/cryptoConfig";
import winston from "winston";

export const transferFundsUninjected = (
  logger: winston.Logger,
  erc20: Erc20,
  cryptoConfig: CryptoConfig,
  transactionSubmissionClient: ITransactionSubmissionClient,
) => async (transferEvmFundsParams: TransferEvmFundsParams) => {
  logger.info(`Processing Order: ${JSON.stringify(transferEvmFundsParams)}`)
  const fromAddress = await transactionSubmissionClient.getFromAddress(cryptoConfig.polygonAssetId)
  logger.info(`Sending From: ${fromAddress}`)

  let transaction: EvmTransaction;
  if (transferEvmFundsParams.assetSymbol) {
    transaction = await erc20.getPolygonErc20TransferTransaction({
      fromAddress: fromAddress,
      toAddress: transferEvmFundsParams.toAddress,
      amountInAsset: transferEvmFundsParams.amountInAsset,
      assetSymbol: transferEvmFundsParams.assetSymbol
    });
  } else {
    transaction = await erc20.getPolygonTransferTransaction({
      fromAddress: fromAddress,
      toAddress: transferEvmFundsParams.toAddress,
      amount: transferEvmFundsParams.amountInAsset,
    });
  }
  logger.info(`Transaction: ${JSON.stringify(transaction)}`)
  return await transactionSubmissionClient.sendPolygonTransaction(transaction);
}