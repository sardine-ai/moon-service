/* eslint-disable @typescript-eslint/no-explicit-any */

import { EvmTransaction } from "src/types/evmTransaction";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import { CryptoConfig } from "src/config/cryptoConfig";
import  { getPolygonGasDetails } from "../utils/cryptoUtils";
import { AbiItem } from "web3-utils"
import abi from "../abi/ERC20ABI.json";

export class Erc20 {
  private cryptoConfig: CryptoConfig;

  constructor(cryptoConfig: CryptoConfig) {
    this.cryptoConfig = cryptoConfig;
  }

  loadErc20Contract(web3: AlchemyWeb3, assetContractAddress: string): any {
    const contract = new web3.eth.Contract(abi as unknown as AbiItem, assetContractAddress);
    return contract;
  }

  getCallData(web3: AlchemyWeb3, toAddress: string, amount: number, assetContractAddress: string) {
    const contract = this.loadErc20Contract(web3, assetContractAddress);
    // TODO model contracts better, 18 shouldn't be hard coded needs to be a property of the asset contract address
    return contract.methods.transfer(toAddress, (amount * 10 ** 18).toString()).encodeABI();
  }

  async getPolygonTransferTransaction({ fromAddress, toAddress, amountInAsset, assetContractAddress }: PolygonTransferParams): Promise<EvmTransaction> {
    const polygonGasDetails = await getPolygonGasDetails(this.cryptoConfig.polygonChain);
    const web3 = createAlchemyWeb3(this.cryptoConfig.maticRPC);
    const transaction: EvmTransaction = {
      from: fromAddress,
      to: assetContractAddress,
      nonce: await web3.eth.getTransactionCount(fromAddress),
      gas: 50000,
      maxPriorityFeePerGas: Math.round(polygonGasDetails.standard.maxPriorityFee * 10 ** 9),
      data: this.getCallData(web3, toAddress, amountInAsset, assetContractAddress),
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