import { calculateGasCost, calculateMaxFeePerGas, getTestGasDetails } from "../../src/clients/transactions/gas";

describe('Testing Gas Calculation Logic', () => {
  test('it calculated gas cost', async () => {
    const gasDetails = await getTestGasDetails('', {} as any, {} as any);
    const gasCost = calculateGasCost(gasDetails);
    expect(gasCost).toEqual("1.4823138912789497e+21");
  });

  test('it calculates max fee per gas', async () => {
    const gasDetails = await getTestGasDetails('', {} as any, {} as any);
    const maxFeePerGas = calculateMaxFeePerGas(gasDetails);
    expect(maxFeePerGas).toEqual("67793436624");
  });
});