import { executeBundleUninjected } from "@/orchestrators";
import { buildTransferFundsBundle } from "@/commands/transfer-funds";
import { getBundle, storeBundle, updateTransaction } from "@/repositories/test-repository";
import { Bundle, Operation, createBundle, TransactionState } from "@/types/models";
import logger from "@/loaders/logger";
import { TestTransactionSubmissionClient } from "@/clients/transactions";

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

  const testTransactionSubmissionClient = new TestTransactionSubmissionClient();
  const executeBundle = executeBundleUninjected(
    testTransactionSubmissionClient,
    updateTransaction,
    logger,
  )

  test('it should store the bundle', async () => {
    console.log("bundle", bundle);
    executeBundle(bundle);
    const storedbundle = await getBundle(bundle.id);
    expect(storedbundle?.transactions[0].state).toEqual(TransactionState.SUBMITTED);
  })
});