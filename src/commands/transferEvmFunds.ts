import { TransferEvmFundsParams } from "src/types/transfer";
import { ITransactionSubmissionClient } from "../clients/transactions";
import { swapUsdcToEth } from "./index";


export const buyGenieNFTUninjected = (
  transactionSubmissionClient: ITransactionSubmissionClient
) => async (transferEvmFundsParams: TransferEvmFundsParams) => {
  await Promise.all(transferEvmFundsParams.orders.map(order => {
    let transaction = 
    transactionSubmissionClient.sendTransaction(order.assetId, callData);
  }))
  const callData = evm.getCallData(transferEvmFundsParams);
  
}