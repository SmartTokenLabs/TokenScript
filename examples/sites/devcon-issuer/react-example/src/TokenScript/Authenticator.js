import tokenMock from './tokenMock';

export const Authenticator = {
  // Return owner Address
  findOwner: function async() {
    tokenMock[0].token.ownerAddress = 2;
    return tokenMock[0].token.ownerAddress;
  },
  // Return if the user is already authenticated
  getAuthenticationBlob: function async() {
    return "Authenticated";
  },
  // Return if the asset belongs to the user
  assetOwnerAddress: function async() {
    return true;
  }
}
