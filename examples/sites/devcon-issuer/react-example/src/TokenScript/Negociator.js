import tokenMock from './tokenMock';

class Negociator {
  constructor(filter) {
    const filter = filter;
  }
  async negociate() {
    // May open the modal. Oleg will manage the modal
    // 
  }
  async getTokenInstances() {
    // Negociator.getTokenInstances() - Can be used to check the client tokens against the blockchain tokens (to ensure they are still valid)
    // return new Promise((resolve, reject) => {
    return resolve(tokenMock);
    // });
  }
}

export {
  Negociator
};