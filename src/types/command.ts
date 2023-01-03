import { BuyGenieNFTParams } from './genie';
import { Bundle } from './models';
import { FireblocksWebhookResponse } from './fireblocks';
import {
  GetBundleStatusParams,
  SwapTokensParams,
  BuyClubHouseNFTParams,
  TransferEvmFundsParams,
  BuyNftParams
} from './requests';
import { BundleReceiptResponse } from './models/receipt';

export type CommandParams = TransferEvmFundsParams &
  BuyClubHouseNFTParams &
  BuyGenieNFTParams &
  BuyNftParams &
  SwapTokensParams &
  FireblocksWebhookResponse &
  GetBundleStatusParams;

export type BuildBundle = (params: CommandParams) => Promise<Bundle>;

export type Command = (params: CommandParams) => Promise<BundleReceiptResponse>;
