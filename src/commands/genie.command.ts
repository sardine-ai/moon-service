import { Environment } from "../controllers/bootstrap";
import { BuyGenieNFTParams } from "../clients/genie";
import { GenieCallDataResponse } from "../clients/genie"
import { swapUsdcToEth } from "./uniswap.command";

export const buyGenieNFT = async (BuyGenieNFTParams: BuyGenieNFTParams, environment: Environment) => {
  let callData: GenieCallDataResponse = await environment.genieClient.getCallData(BuyGenieNFTParams);
  await swapUsdcToEth(callData.valueToSend, environment)
  await environment.fireblocksClient.sendEthTransaction(
    environment.vaultAccountId,
    {
      to: callData.to,
      amountEth: callData.valueToSend,
      data: callData.data
    }
  )
}