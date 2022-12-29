import { ITransactionSubmissionClient } from '@/clients/transactions';
import { GenieClient } from '@/clients/genie';
import { BuyGenieNFTParams, GenieCallDataResponse } from '@/types/genie';
import { swapUsdcToEth } from './index';
import { CryptoConfig } from '@/config/crypto-config';

export const buyGenieNFTUninjected =
  (
    genieClient: GenieClient,
    _transactionSubmissionClient: ITransactionSubmissionClient,
    _cryptoConfig: CryptoConfig
  ) =>
  async (BuyGenieNFTParams: BuyGenieNFTParams) => {
    const callData: GenieCallDataResponse = await genieClient.getCallData(
      BuyGenieNFTParams
    );
    await swapUsdcToEth(callData.valueToSend);
    // await transactionSubmissionClient.sendTransaction({
    //   to: callData.to,
    //   value: callData.valueToSend,
    //   callData: callData.data,
    //   chain: cryptoConfig.ethChain,
    //   assetSymbol: "ETH"
    // });
  };
