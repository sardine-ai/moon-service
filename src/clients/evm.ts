import { EvmTransaction } from "src/types/evmTransaction";
import { AlchemyWeb3 } from "@alch/alchemy-web3";

class Erc20 {
  private address: string;
  private web3: AlchemyWeb3;

  constructor(address: string, web3: AlchemyWeb3) {
    this.address = address;
    this.web3 = web3;
  }

  getTransferTransaction(): EvmTransaction {

  }
}