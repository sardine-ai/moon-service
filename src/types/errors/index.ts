export class ApplicationError extends Error {
  cause: unknown;
  name: string;
  message: string;
  status: number;
  constructor(
    cause: unknown,
    name: string, 
    message: string,
    status: number
  ) {
    super();
    this.cause = cause;
    this.name = name;
    this.message = message;
    this.status = status;
  }
}

export type ErrorBuilder = (cause: unknown) => ApplicationError

export const UnauthorizedError: ErrorBuilder = (cause) => {
  return new ApplicationError(cause, 'UnauthorizedError', 'Unauthorized', 404);
}

export const NftNotFoundError: ErrorBuilder = (cause) => {
  return new ApplicationError(cause, 'NftNotFoundError', 'Sorry, this NFT is no longer available', 410);
}

export const TransactionSubmittionError: ErrorBuilder = (cause) => {
  return new ApplicationError(cause, 'TransactionSubmittionError', 'There was an error submitting the transaction', 500);
}
