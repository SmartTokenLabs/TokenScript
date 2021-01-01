import tokenMock from './tokenMock';

export class Negociator {
  constructor(filter) {
    this.filter = filter;
  }
  // Modal / Auto Attestation
  async negociate() {
    return true;
  }
  // Get the token instances (with filter)
  async getTokenInstances() {
    // apply this.filter to actual request
    return tokenMock;
  }
}