import { TransferEvmFundsParams } from './requests/transfer';
import { BuyNftParams } from './requests/nft';
import { Bundle } from './models';

export type CommandParams = TransferEvmFundsParams &
  BuyNftParams

export type BuildBundle = (params: CommandParams) => Promise<Bundle>;
