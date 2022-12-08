// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Erc20Token } from "../types/evm";
// import { getAssetContractDetails } from "../utils/crypto-utils";
// import { AbiItem } from "web3-utils"
// import abi from "../abi/ERC20ABI.json";
// import { Transaction, TransactionState, Operation } from "../types/models";
// import { v4 as uuidV4 } from "uuid";
// import { TransferEvmFundsParams } from "../types/transfer";
// import Web3 from "web3";

// export const loadContract = (assetContractAddress: string): any => {
//   const web3 = new Web3();
//   const contract = new web3.eth.Contract(abi as unknown as AbiItem, assetContractAddress);
//   return contract;
// }

// export const buildTransferErc20CallData = (toAddress: string, amount: number, assetContractDetails: Erc20Token): string => {
//   const contract = loadContract(assetContractDetails.assetContractAddress);
//   const callData = contract.methods.transfer(toAddress, (amount * 10 ** assetContractDetails.decimals).toString()).encodeABI();
//   return callData;
// }

// export const buildEvmTransferTransaction = ({
//   toAddress,
//   amountInAsset,
//   chain,
//   assetSymbol,
// }: TransferEvmFundsParams): Transaction => {
//   const transaction: Transaction = {
//     id: uuidV4(),
//     isStarting: false,
//     state: TransactionState.CREATED,
//     to: toAddress,
//     chain: chain,
//     assetSymbol: assetSymbol,
//     operation: Operation.TRANSFER_FUNDS
//   }
//   if (assetSymbol == "NATIVE") {
//     transaction.value = (amountInAsset * 10 ** 18).toString();
//   } else {
//     const assetContractDetails = getAssetContractDetails(chain, assetSymbol);
//     transaction.callData = buildTransferErc20CallData(toAddress, amountInAsset, assetContractDetails);
//     transaction.to = assetContractDetails.assetContractAddress;
//   }
//   return transaction;
// }