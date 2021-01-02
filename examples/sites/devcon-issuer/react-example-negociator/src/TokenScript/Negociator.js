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

    // Get ticket from params
    const urlParams = new URLSearchParams(window.location.search);
    const ticketFromQuery = urlParams.get('ticket');

    // ticketFromQuery format checking - TODO
    // ...

    // Get the current Storage Tokens
    const storageTokens = localStorage.getItem('dcTokens');

    // Parse into JS
    let tokensParsed = storageTokens ? JSON.parse(storageTokens) : [];

    if (ticketFromQuery) {
      // Add New Ticket to array
      tokensParsed.push(ticketFromQuery);
      // Set New tokens list
      localStorage.setItem('dcTokens', JSON.stringify(tokensParsed));
    }

    // Get New tokens list
    const newStorageTokens = localStorage.getItem('dcTokens');

    // web friendly data (transformed)
    const tickets = JSON.parse(newStorageTokens).map((token) => {
      return JSON.parse(token).ticket;
    });

    // TODO's - inside the filter below
    // If the URL has the blob; ticket.devcon.org/ticket?base64BlobHere (1 ticket)
    // - Check if it is different than what is stored locally (local storage)
    // - Store the ticket in local storage / replace the old with this new, if one previosly existed

    // filter out any duplicate tickets
    let idList = [];
    const output = tickets.filter((ticket) => {
      if (idList.indexOf(ticket.ticketId) > -1) return false;
      idList.push(ticket.ticketId);
      return true;
    });

    return output;
  }
}