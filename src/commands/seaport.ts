import { ITransactionSubmissionClient } from "../clients/transactions";
import { OpenSeaClient } from "../clients/openSea";
import { CryptoConfig } from "../config/cryptoConfig";

export const buySeaportNFTUninjected = (
  openSeaClient: OpenSeaClient,
  transactionClient: ITransactionSubmissionClient,
  cryptoConfig: CryptoConfig
) => async (nftId: number, contractAddress: string, recipientAddress: string) => {
  const order = await openSeaClient.getOrder(nftId, contractAddress);
  const callData = await openSeaClient.getFulfillOrderCallData(order.protocolData, cryptoConfig.sardinePublicKey, recipientAddress);
  await transactionClient.sendEthTransaction({
    ...callData,
  });
}