/* eslint-disable @typescript-eslint/no-explicit-any */

import { Erc20Token } from '../types/evm';
import {
  getAssetDetails,
  amountToSmallestDenomination,
  isNativeToken
} from '../utils/crypto-utils';
import { AbiItem } from 'web3-utils';
import abi from '../abi/ERC20ABI.json';
import { Transaction, TransactionState, Operation } from '../types/models';
import { v4 as uuidV4 } from 'uuid';
import { TransferEvmFundsParams } from '../types/requests/transfer';
import Web3 from 'web3';

export const loadContract = (assetContractAddress: string): any => {
  const web3 = new Web3();
  const contract = new web3.eth.Contract(
    abi as unknown as AbiItem,
    assetContractAddress
  );
  return contract;
};

export const buildTransferErc20CallData = (
  toAddress: string,
  amount: number,
  assetContractDetails: Erc20Token
): string => {
  const contract = loadContract(assetContractDetails.assetContractAddress);
  const callData = contract.methods
    .transfer(
      toAddress,
      amountToSmallestDenomination(
        amount,
        assetContractDetails.decimals
      ).toString()
    )
    .encodeABI();
  return callData;
};

export const buildEvmTransferTransaction = ({
  toAddress,
  amountInAsset,
  chain,
  assetSymbol
}: TransferEvmFundsParams): Transaction => {
  const transaction: Transaction = {
    id: uuidV4(),
    assetCosts: [],
    order: -1,
    state: TransactionState.CREATED,
    to: toAddress,
    chain: chain,
    operation: Operation.TRANSFER_FUNDS
  };
  const assetContractDetails = getAssetDetails(chain, assetSymbol);
  if (isNativeToken(assetSymbol, chain)) {
    const value = amountToSmallestDenomination(
      amountInAsset,
      assetContractDetails.decimals
    )
      .toString()
      .toString();
    transaction.value = value;
  } else {
    transaction.callData = buildTransferErc20CallData(
      toAddress,
      amountInAsset,
      assetContractDetails
    );
    transaction.to = assetContractDetails.assetContractAddress;
  }
  transaction.assetCosts = [
    {
      assetSymbol: assetSymbol,
      amount: amountToSmallestDenomination(
        amountInAsset,
        assetContractDetails.decimals
      ).toString(),
      decimals: getAssetDetails(chain, assetSymbol).decimals
    }
  ];

  return transaction;
};
