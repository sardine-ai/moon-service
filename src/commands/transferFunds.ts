import { TransferEvmFundsParams } from "src/types/transfer";
import { ITransactionSubmissionClient } from "../clients/transactions";
import { Erc20 } from "src/clients/evm";
import { EvmTransaction } from "src/types/evmTransaction";
import { CryptoConfig } from "src/config/cryptoConfig";

export const transferPolygonFunds = (
  cryptoConfig: CryptoConfig,
  transactionSubmissionClient: ITransactionSubmissionClient,
  erc20: Erc20,
) => async (transferEvmFundsParams: TransferEvmFundsParams) => {
  transferEvmFundsParams.orders.forEach( async (order) => {
    const fromAddress = await transactionSubmissionClient.getFromAddress(cryptoConfig.polygonAssetId)
    let transaction: EvmTransaction = await erc20.getPolygonTransferTransaction({
      fromAddress: fromAddress,
      toAddress: order.recepientAddress,
      amountInAsset: order.amountInNativeToken,
      assetContractAddress: order.assetContractAddress
    });
  });
}