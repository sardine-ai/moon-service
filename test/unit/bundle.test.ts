import { executeBundleUninjected } from "../../src/clients/transactions/helpers";
import { buildTransferFundsBundle } from "../../src/commands/transfer-funds";
import { getBundle, storeBundle, updateTransaction } from "../../src/repositories/test-repository";
import { Bundle, BundleOperations, createBundle, TransactionState } from "../../src/types/models";
import logger from "../../src/loaders/logger";
import { TestTransactionSubmissionClient } from "../../src/clients/transactions";

describe('Testing Bundle Logic', () => {
  test('it should create a Bundle', () => {
    const bundle = createBundle(BundleOperations.TRANSFER_FUNDS);
    expect(bundle.operation).toEqual(BundleOperations.TRANSFER_FUNDS);
    expect(bundle.transactions.length).toEqual(0);
  });

  let bundle: Bundle;

  test('it should create a transfer funds bundle', () => {
    bundle = buildTransferFundsBundle({
      amountInAsset: 1,
      assetSymbol: "WETH",
      chain: "polygon_test",
      toAddress: "0x4cc1756281D7203A172C63E9df9307dABA5523A8"
    })
    expect(bundle.transactions.length).toEqual(1);
    expect(bundle.transactions[0].isStarting).toEqual(true);
  })

  test('it should store the bundle', async () => {
    storeBundle(bundle);
    const storedbundle = await getBundle(bundle.id);
    expect(storedbundle).toEqual(bundle);
  })

  const testTransactionSubmissionClient = new TestTransactionSubmissionClient(logger);
  const executeBundle = executeBundleUninjected(
    testTransactionSubmissionClient,
    updateTransaction,
    logger,
  )

  test('it should store the bundle', async () => {
    executeBundle(bundle);
    const storedbundle = await getBundle(bundle.id);
    expect(storedbundle?.transactions[0].state).toEqual(TransactionState.SUBMITTED);
  })
});