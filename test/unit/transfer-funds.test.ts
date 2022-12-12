import { buildEvmTransferTransaction } from "../../src/clients/evm";
import { Operation, TransactionState } from "../../src/types/models";

describe('Testing Transfer Funds Logic', () => {
  test('it builds evm transfer transaction for native token', () => {
    const transaction = buildEvmTransferTransaction({
      toAddress: "0x4cc1756281D7203A172C63E9df9307dABA5523A8",
      amountInAsset: 1,
      chain: "polygon_test",
      assetSymbol: "NATIVE"
    })
    transaction.id = "0"
    expect(transaction).toEqual({
      id: "0",
      isStarting: false,
      state: TransactionState.CREATED,
      to: "0x4cc1756281D7203A172C63E9df9307dABA5523A8",
      chain: "polygon_test",
      assetSymbol: "NATIVE",
      value: (1 * 10 ** 18).toString(),
      operation: Operation.TRANSFER_FUNDS
    });
  });

  test('it builds evm transfer transaction for arbitrary token', () => {
    const transaction = buildEvmTransferTransaction({
      toAddress: "0x4cc1756281D7203A172C63E9df9307dABA5523A8",
      amountInAsset: 0.00001,
      chain: "polygon_test",
      assetSymbol: "WETH"
    })
    transaction.id = "0"
    expect(transaction).toEqual({
      id: "0",
      isStarting: false,
      state: TransactionState.CREATED,
      to: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
      chain: "polygon_test",
      assetSymbol: "WETH",
      callData: "0xa9059cbb0000000000000000000000004cc1756281d7203a172c63e9df9307daba5523a8000000000000000000000000000000000000000000000000000009184e72a000",
      operation: Operation.TRANSFER_FUNDS
    });
  });
});