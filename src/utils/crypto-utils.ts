import axios from 'axios';
import { PolgyonGasDetails } from "src/types/transfer/polygon";

const POLYGON_NETWORK_TO_GAS_URL: { [name: string]: string } = {
  "polygon_test": "https://gasstation-mumbai.matic.today/v2",
  "polygon": "https://gasstation-mainnet.matic.network/v2",
  "mainnet": "https://ethgasstation.info/api/ethgasAPI.json?",
  "goerli": ""
}

export const getPolygonGasDetails = async (chain: string): Promise<PolgyonGasDetails> => {
  const url = POLYGON_NETWORK_TO_GAS_URL[chain];
  const result = await axios(url);
  return result.data;
}

import { Erc20Token } from "src/types/evm"

interface AssetContractDetails {
  [key: string]: {
    [key: string]: Erc20Token
  }
}

const ASSET_CONTRACT_DETAILS: AssetContractDetails = {
  "goerli": {
    "USDC": {
      assetContractAddress: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
      decimals: 6,
    },
    "WETH": {
      assetContractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      decimals: 18,
    }
  },
  "mainnet": {
    "USDC": {
      assetContractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6
    },
    "WETH": {
      assetContractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18
    }
  },
  "polygon_test": {
    "USDC": {
      assetContractAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
      decimals: 6
    },
    "WETH": {
      assetContractAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
      decimals: 18
    }
  },
  "polygon": {
    "USDC": {
      assetContractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6
    },
    "WETH": {
      assetContractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18
    }
  }
}

export const getAssetContractDetails = (chain: string, assetSymbol: string): Erc20Token => {
  return ASSET_CONTRACT_DETAILS[chain][assetSymbol]
}
