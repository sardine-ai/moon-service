export class UnauthorizedError extends Error {
  // parent error
  status: number;

  constructor() {
    super();
    this.name = this.constructor.name; // good practice

    this.message = 'Unauthorized';
    this.status = 404; // error code for responding to client
  }
}

export class NftNotFoundError extends Error {
  // parent error
  status: number;

  constructor() {
    super();
    this.name = this.constructor.name; // good practice

    this.message = 'Sorry, this NFT is no longer available';
    this.status = 410; // error code for responding to client
  }
}

export class TransactionSubmittionError extends Error {
  // parent error
  status: number;

  constructor() {
    super();
    this.name = this.constructor.name; // good practice

    this.message = 'There was an error submitting the transaction';
    this.status = 500; // error code for responding to client
  }
}
