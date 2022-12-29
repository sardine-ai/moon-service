import { GasDetails } from '../../types/evm';
import { Transaction } from '../../types/models';
import { CryptoConfig } from '../../config/crypto-config';
import { getChainAlchemy } from './helpers';

export type GetGasDetails = (
  fromAddress: string,
  transaction: Transaction,
  cryptoConfig: CryptoConfig
) => Promise<GasDetails>;

export const getAlchemyGasDetails: GetGasDetails = async (
  fromAddress: string,
  transaction: Transaction,
  cryptoConfig: CryptoConfig
): Promise<GasDetails> => {
  const alchemy = getChainAlchemy(transaction.chain, cryptoConfig);
  const gasLimit = await alchemy.eth.estimateGas({
    from: fromAddress,
    to: transaction.to,
    data: transaction.callData,
    value: transaction.value
  });
  const maxPriorityFeePerGas = await alchemy.eth.getMaxPriorityFeePerGas();
  const feeHistory = await alchemy.eth.getFeeHistory(1, 'latest', []);
  return {
    maxPriorityFee: maxPriorityFeePerGas,
    gasLimit: gasLimit.toString(),
    baseFeePerGas: parseInt(feeHistory.baseFeePerGas[0], 10).toString()
  };
};

export const getTestGasDetails: GetGasDetails = async (
  _fromAddress: string,
  _transaction: Transaction,
  _cryptoConfig: CryptoConfig
): Promise<GasDetails> => {
  return {
    maxPriorityFee: '1500000000',
    gasLimit: '42783673707',
    baseFeePerGas: '33146718312'
  };
};

export const calculateGasCost = (gasDetails: GasDetails): string => {
  const gasCost =
    Number(gasDetails.gasLimit || 0) *
    (Number(gasDetails.maxPriorityFee) + Number(gasDetails.baseFeePerGas || 0));

  return gasCost.toString();
};

export const calculateMaxFeePerGas = (gasDetails: GasDetails) => {
  return (
    2 * Number(gasDetails?.baseFeePerGas || '0') +
    Number(gasDetails?.maxPriorityFee || '0')
  ).toString();
};
