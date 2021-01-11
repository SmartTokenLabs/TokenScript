export const Authenticator = {
  getAuthenticationBlob: async ({ ticket }) => {
    return btoa(ticket.ticketId);
  },
  fetchChallenge: async () => {
    return fetch('./Authentication/getChallenge.json',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        return data.value;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },
  signChallenge: async ({ useTicketProof, challenge }) => {
    return `{challenge: ${challenge}, proof: ${atob(useTicketProof)}}`;
  },
  sendChallenge: async ({ signedMsg }) => {
    return fetch('./Authentication/validChallenge.json', {
      method: 'GET', // POST for actual app (can't use POST in this simple mock example)
      // body: signedMsg // body used for actual app (can't use POST in this simple mock example)
    })
      .then(response => response.json())
      .then(data => {
        return data.value;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  assetOwnerAddress: async () => { }, // return; to confirm the function of this
  findOwner: async () => { }, // return ownerAddress
}
