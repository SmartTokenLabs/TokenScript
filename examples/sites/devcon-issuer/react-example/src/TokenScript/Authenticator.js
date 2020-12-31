import tokenMock from './tokenMock';

const Authenticator = {
  findOwner: function async() {
    return new Promise((resolve, reject) => {
      tokenMock[0].token.ownerAddress = 2;
      return resolve(tokenMock[0].token.ownerAddress);
    });
  },
  getAuthenticationBlob: function async() {
    return new Promise((resolve, reject) => {
      return resolve("Authenticated");
    });
  },
  assetOwnerAddress: function async() {
    return true;
  }
}

export {
  Authenticator
};