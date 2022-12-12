import { Bundle } from "../../src/types/models";

export const updateBundleWithFakeId = (bundle: Bundle, newId: string) => {
  bundle.id = newId;
  bundle.transactions = bundle.transactions.map(t => {
    t.id = newId;
    t.bundleId = newId;
    return t;
  })
  return bundle;
}