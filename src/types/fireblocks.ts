export interface FireblocksWebhookResponse {
  type: FireblocksWebhookType,
  tenantId: string,
  timestamp: number,
  data: {
    id: string,
    createdAt: number,
    lastUpdated: number,
    assetId: string,
    source: {
      id: string,
      type: string,
      name: string,
      subType: string
    },
    destination: {
      id: string,
      type: string,
      name: string,
      subtype: string
    },
    amount: number,
    networkFee: number,
    netAmount: number,
    sourceAddress: string,
    destinationAddress: string,
    destinationAddressDescription: string,
    destinationTag: string,
    status: TransactionStatus,
    txHash: string,
    subStatus: string,
    signedBy: Array<string>,
    createdBy: string,
    rejectedBy: string,
    amountUSD: number,
    addressType: string,
    note: string,
    exchangeTxId: string,
    feeCurrency: string,
    operation: FireblocksOperation,
    customerRefId: string,
    numOfConfirmations: number,
    amountInfo: {
      amount: string,
      requestAmount: string,
      netAmount: string,
      amountUSD: string
    },
    feeInfo: {
      networkFee: string,
      gasPrice: string
    },
    destinations: Array<string>,
    externalTxId: string,
    blockInfo: {
      blockHeight: string,
      blockHash: string
    }
    signedMessages: Array<string>,
    extraParameters: {
      contractCallData: string
    }
  }
}

enum FireblocksWebhookType {
	TRANSACTION_CREATED = 'TRANSACTION_CREATED',
	TRANSACTION_STATUS_UPDATED = 'TRANSACTION_STATUS_UPDATED',
}

enum TransactionStatus {
	SUBMITTED = 'SUBMITTED',
	QUEUED = 'QUEUED',
	PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  BROADCASTING = 'BROADCASTING',
	CONFIRMING = 'CONFIRMING',
  COMPLETED = 'COMPLETED'
}

enum FireblocksOperation {
	BURN = 'BURN',
	CONTRACT_CALL = 'CONTRACT_CALL',
	MINT = 'MINT',
  RAW = 'RAW',
	REDEEM_FROM_COMPOUND = 'REDEEM_FROM_COMPOUND',
	SUPPLY_TO_COMPOUND = 'SUPPLY_TO_COMPOUND',
  TRANSFER = 'TRANSFER',
	TYPED_MESSAGE = 'TYPED_MESSAGE'
}