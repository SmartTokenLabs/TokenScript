import tokenMock from './tokenMock';

export const Authenticator = {
  findOwner: async () => {
    tokenMock[0].token.ownerAddress = 2;
    return tokenMock[0].token.ownerAddress;
  },
  getAuthenticationBlob: async (ticket) => {
    return ticket;
  },
  assetOwnerAddress: async () => {
    return true;
  },
  fetchChallenge: async () => {
    fetch('./Authentication/getChallenge.json',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },
  signChallenge: async (useTicketProof, challenge) => {
    // signedMsg
    return `{challenge: ${challenge}, proof: ${atob(useTicketProof)}}`;
  },
  sendChallenge: async () => {
    fetch('./Authentication/validChallenge.json', {
      method: 'POST',
      body: signedMsg
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}
