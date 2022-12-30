import { executeBundleUninjected } from "../../src/orchestrators";
import { buildTransferFundsBundle } from "../../src/commands/transfer-funds";
import { getBundle, storeBundle, updateTransaction } from "../../src/repositories/test-repository";
import { Bundle, Operation, createBundle, TransactionState } from "../../src/types/models";
import { TestTransactionSubmissionClient } from "../../src/clients/transactions";
import { getTestCryptoConfig } from "../../src/config/crypto-config";
import { getTestGasDetails } from "../../src/clients/transactions/gas";

describe('Testing Bundle Logic', () => {
  test('it should create a Bundle', () => {
    const bundle = createBundle(Operation.TRANSFER_FUNDS);
    expect(bundle.operation).toEqual(Operation.TRANSFER_FUNDS);
    expect(bundle.transactions.length).toEqual(0);
  });

  let bundle: Bundle;

  test('it should create a transfer funds bundle', async () => {
    bundle = await buildTransferFundsBundle({
      amountInAsset: 1,
      assetSymbol: "WETH",
      chain: "polygon_test",
      toAddress: "0x4cc1756281D7203A172C63E9df9307dABA5523A8"
    })
    expect(bundle.transactions.length).toEqual(1);
    expect(bundle.transactions[0].order == 0).toEqual(true);
  })

  test('it should store the bundle', async () => {
    storeBundle(bundle);
    const storedbundle = await getBundle(bundle.id);
    expect(storedbundle).toEqual(bundle);
  })

  const testCryptoConfig = getTestCryptoConfig();
  const transactionSubmissionClient = new TestTransactionSubmissionClient(testCryptoConfig, getTestGasDetails);
  const executeBundle = executeBundleUninjected(
    transactionSubmissionClient,
    updateTransaction,
  )

  test('it should store the bundle', async () => {
    executeBundle(bundle);
    const storedbundle = await getBundle(bundle.id);
    expect(storedbundle?.transactions[0].state).toEqual(TransactionState.SUBMITTED);
  })
});