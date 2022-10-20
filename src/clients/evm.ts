/* eslint-disable @typescript-eslint/no-explicit-any */

import { EvmTransaction } from "src/types/evmTransaction";
import { AlchemyWeb3 } from "@alch/alchemy-web3";
import { CryptoConfig } from "src/config/cryptoConfig";
import  { getPolygonGasDetails } from "../utils/cryptoUtils";
import { AbiItem } from "web3-utils"
import abi from "../abi/ERC20ABI.json";

export class Erc20 {
  private web3: AlchemyWeb3;
  private cryptoConfig: CryptoConfig;

  constructor(web3: AlchemyWeb3, cryptoConfig: CryptoConfig) {
    this.web3 = web3;
    this.cryptoConfig = cryptoConfig;
  }

  loadErc20Contract(assetContractAddress: string): any {
    const contract = new this.web3.eth.Contract(abi as unknown as AbiItem, assetContractAddress);
    return contract;
  }

  getCallData(fromAddress: string, toAddress: string, amount: number, assetContractAddress: string) {
    const contract = this.loadErc20Contract(assetContractAddress);
    return contract.methods.transferFrom(fromAddress, toAddress, amount).encodeABI();
  }

  async getPolygonTransferTransaction({ fromAddress, toAddress, amountInAsset, assetContractAddress }: PolygonTransferParams): Promise<EvmTransaction> {
    const polygonGasDetails = await getPolygonGasDetails(this.cryptoConfig.polygonChain);
    const transaction: EvmTransaction = {
      from: fromAddress,
      to: toAddress,
      nonce: await this.web3.eth.getTransactionCount(fromAddress),
      maxPriorityFeePerGas: polygonGasDetails.standard.maxPriorityFee,
      data: this.getCallData(fromAddress, toAddress, amountInAsset, assetContractAddress),
      chainId: this.cryptoConfig.polygonChainId
    }
    return transaction;
  }
}

interface PolygonTransferParams {
  fromAddress: string,
  toAddress: string,
  amountInAsset: number,
  assetContractAddress: string
}