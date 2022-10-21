import { TransferEvmFundsParams } from "src/types/transfer";
import { ITransactionSubmissionClient } from "../clients/transactions";
import { Erc20 } from "src/clients/evm";
import { EvmTransaction } from "src/types/evmTransaction";
import { CryptoConfig } from "src/config/cryptoConfig";
import Logger from '../loaders/logger';

export const transferFundsUninjected = (
  erc20: Erc20,
  cryptoConfig: CryptoConfig,
  transactionSubmissionClient: ITransactionSubmissionClient,
) => async (transferEvmFundsParams: TransferEvmFundsParams) => {
  transferEvmFundsParams.orders.forEach( async (order) => {
    Logger.info(`Processing Order: ${JSON.stringify(order)}`)
    const fromAddress = await transactionSubmissionClient.getFromAddress(cryptoConfig.polygonAssetId)
    Logger.info(`Sending From: ${fromAddress}`)
    const transaction: EvmTransaction = await erc20.getPolygonTransferTransaction({
      fromAddress: fromAddress,
      toAddress: order.toAddress,
      amountInAsset: order.amountInAsset,
      assetContractAddress: order.assetContractAddress || cryptoConfig.polygonUsdAddress
    });
    Logger.info(`Transaction: ${JSON.stringify(transaction)}`)
    return await transactionSubmissionClient.sendPolygonTransaction(transaction);
  });
}