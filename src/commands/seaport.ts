import { ITransactionSubmissionClient } from "../clients/transactions";
import { OpenSeaClient } from "../clients/opensea";
import { CryptoConfig } from "../config/crypto-config";
import winston from "winston";

export const buySeaportNFTUninjected = (
  _logger: winston.Logger,
  openSeaClient: OpenSeaClient,
  transactionClient: ITransactionSubmissionClient,
  cryptoConfig: CryptoConfig
) => async (nftId: number, contractAddress: string, recipientAddress: string) => {
  const order = await openSeaClient.getOrder(nftId, contractAddress);
  const callData = await openSeaClient.getFulfillOrderCallData(order.protocolData, cryptoConfig.sardinePublicKey, recipientAddress);
  await transactionClient.sendEthTransaction({
    from: callData.from,
    to: callData.to,
    gas: callData.gasLimit?.toString(),
    gasPrice: callData.gasPrice?.toString(),
    maxPriorityFeePerGas: callData.maxPriorityFeePerGas?.toString(),
    maxFeePerGas: callData.maxFeePerGas?.toString(),
    data: callData.data,
    value: callData.value?.toString(),
    chainId: callData.chainId
  });
}