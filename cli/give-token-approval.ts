import { BigNumber } from 'bignumber.js';
import { loadContract } from '../src/clients/evm';
import { FireblocksClient } from '../src/clients/transactions';
import getFireblocksConfig from '../src/config/fireblocks-config';
import getCryptoConfig from '../src/config/crypto-config';
import { getAlchemyGasDetails } from '../src/clients/transactions/gas';
import { Operation, TransactionState } from '../src/types/models';

export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
  .pow(256)
  .minus(1);

const giveTokenApproval = async () => {
  if (process.argv.length < 4) {
    console.log(
      'You did not pass a contract address and or aproval for address'
    );
    return;
  }
  const contractAddress = process.argv[2];
  const approvalFor = process.argv[3];
  const contract = loadContract(contractAddress);
  const callData = contract.methods
    .approve(approvalFor, UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
    .encodeABI();

  const fireblocksConfig = getFireblocksConfig();
  const cryptoConfig = getCryptoConfig();
  const fireblocksClient = new FireblocksClient(
    fireblocksConfig,
    cryptoConfig,
    getAlchemyGasDetails
  );
  const response = await fireblocksClient.sendTransaction({
    id: '-1',
    bundleId: '-1',
    order: 0,
    state: TransactionState.CREATED,
    operation: Operation.UNKNOWN,
    chain: 'goerli',
    to: contractAddress,
    callData: callData
  });
  console.log(response);
};

giveTokenApproval().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  }
);
