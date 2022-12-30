import { FireblocksClient, TestTransactionSubmissionClient } from "../../src/clients/transactions";
import { Operation, Transaction, TransactionState } from "../../src/types/models";
import { getTestCryptoConfig } from "../../src/config/crypto-config";
import getFireblocksConfig from "../../src/config/fireblocks-config";
import { getTestGasDetails } from "../../src/clients/transactions/gas"; 

describe('Testing Transaction Logic', () => {
  const cryptoConfig = getTestCryptoConfig();
  const fireblocksConfig = getFireblocksConfig();
  const fakeTransactionClient = new TestTransactionSubmissionClient(
    cryptoConfig,
    getTestGasDetails
  )
  const fakeFireblocksClient = new FireblocksClient(
    fireblocksConfig,
    cryptoConfig,
    getTestGasDetails
  )
  
  test('it builds evm transaction', async () => {
    const transaction: Transaction = {
      id: "0",
      bundleId: "0",
      order: 0,
      state: TransactionState.CREATED,
      operation: Operation.UNKNOWN,
      chain: "goerli",
      to: "0xtoAddress",
      value: "1000",
      callData: "0xcallData"
    }
    const evmTransaction = await fakeTransactionClient.convertTransactionToEvmTransaction(
      transaction
    )
    expect(evmTransaction).toEqual({
      chain: "goerli",
      chainId: 5,
      data: "0xcallData",
      from: "0x123456",
      gas: "42783673707",
      maxFeePerGas: "67793436624",
      maxPriorityFeePerGas: "1500000000",
      nonce: 0,
      to: "0xtoAddress",
      value: "1000",
    });
  });

  test('it builds fireblocks transaction arguments', () => {
    const transactionArguments = fakeFireblocksClient.buildTransactionArguments({
      chain: "goerli",
      chainId: 5,
      data: "0xcallData",
      from: "0x123456",
      gas: "42783673707",
      maxFeePerGas: "67793436624",
      maxPriorityFeePerGas: "1500000000",
      nonce: 0,
      to: "0xtoAddress",
      value: "1000",
    },{
      id: "id",
      assetId: "assetId"
    })
    expect(transactionArguments).toEqual({
      amount: "0.000000000000001",
      assetId: "ETH_TEST3",
      destination: {
        id: "",
        oneTimeAddress: {
          address: "0xtoAddress",
        },
        type: "ONE_TIME_ADDRESS",
      },
      extraParameters: {
        contractCallData: "0xcallData",
      },
      gasLimit: "42783673707",
      maxFee: "67.793436624",
      note: "",
      operation: "CONTRACT_CALL",
      priorityFee: "1.5",
      source: {
        id: "id",
        type: "VAULT_ACCOUNT",
      }
    });
  });
});