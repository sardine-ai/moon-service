export interface BundleQuote {
  totalCost: number;
  transactionQuotes: Array<TransactionQuote>;
}

export interface TransactionQuote {
  totalCost: number;
  cost: number;
  gasCost: number;
  currency: string;
}