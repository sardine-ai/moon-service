/* eslint-disable @typescript-eslint/no-explicit-any */

import { EvmTransaction, Erc20Token } from "src/types/evm";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import { CryptoConfig } from "src/config/crypto-config";
import  { getPolygonGasDetails } from "../utils/crypto-utils";
import { getAssetContractDetails } from "../constants";
import { AbiItem } from "web3-utils"
import abi from "../abi/ERC20ABI.json";
import winston from "winston";

export class Erc20 {
  logger: winston.Logger;
  cryptoConfig: CryptoConfig;

  constructor(logger: winston.Logger, cryptoConfig: CryptoConfig) {
    this.logger = logger;
    this.cryptoConfig = cryptoConfig;
  }

  loadErc20Contract(web3: AlchemyWeb3, assetContractAddress: string): any {
    const contract = new web3.eth.Contract(abi as unknown as AbiItem, assetContractAddress);
    return contract;
  }

  getCallData(web3: AlchemyWeb3, toAddress: string, amount: number, assetContractDetails: Erc20Token) {
    const contract = this.loadErc20Contract(web3, assetContractDetails.assetContractAddress);
    return contract.methods.transfer(toAddress, (amount * 10 ** assetContractDetails.decimals).toString()).encodeABI();
  }

  async getPolygonErc20TransferTransaction({ fromAddress, toAddress, amountInAsset, assetSymbol }: Erc20TransferParams): Promise<EvmTransaction> {
    // REFACTOR getPolygonGasDetails makes this an action
    const polygonGasDetails = await getPolygonGasDetails(this.cryptoConfig.polygonChain);
    const assetContractDetails = getAssetContractDetails(this.cryptoConfig.polygonChain, assetSymbol);
    const web3 = createAlchemyWeb3(this.cryptoConfig.maticRPC);
    const transaction: EvmTransaction = {
      from: fromAddress,
      to: assetContractDetails.assetContractAddress,
      nonce: await web3.eth.getTransactionCount(fromAddress),
      gas: "50000",
      maxPriorityFeePerGas: Math.round(polygonGasDetails.standard.maxPriorityFee * 10 ** 9).toString(),
      data: this.getCallData(web3, toAddress, amountInAsset, assetContractDetails),
      chainId: this.cryptoConfig.polygonChainId
    }
    return transaction;
  }

  async getPolygonTransferTransaction({fromAddress, toAddress, amount}: EvmTransferParams) {
    // REFACTOR getPolygonGasDetails makes this an action
    const polygonGasDetails = await getPolygonGasDetails(this.cryptoConfig.polygonChain);
    const web3 = createAlchemyWeb3(this.cryptoConfig.maticRPC);
    const transaction: EvmTransaction = {
      from: fromAddress,
      to: toAddress,
      value: amount.toString(),
      nonce: await web3.eth.getTransactionCount(fromAddress),
      gas: "50000",
      maxPriorityFeePerGas: Math.round(polygonGasDetails.standard.maxPriorityFee * 10 ** 9).toString(),
      chainId: this.cryptoConfig.polygonChainId
    }
    return transaction;
  }
}

interface Erc20TransferParams {
  fromAddress: string,
  toAddress: string,
  amountInAsset: number,
  assetSymbol: string
}

interface EvmTransferParams {
  fromAddress: string,
  toAddress: string,
  amount: number,
}