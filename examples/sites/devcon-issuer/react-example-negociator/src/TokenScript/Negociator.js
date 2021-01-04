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

    // Get the current Storage Tokens
    const storageTokens = localStorage.getItem('dcTokens');

    // Parse into JS
    let tokensParsed = storageTokens ? JSON.parse(storageTokens) : [];

    // Parse ticket for validation
    const ticketFromQueryParsed = JSON.parse(ticketFromQuery);

    // Check if ticket is valid (rules)
    const isValidTicket = (
      ticketFromQueryParsed &&
      ticketFromQueryParsed.ticket &&
      ticketFromQueryParsed.ticket.ticketId &&
      ticketFromQueryParsed.ticket.ticketClass &&
      ticketFromQueryParsed.ticket.devconId
    );

    if (isValidTicket) {

      // Store the filtered tickets
      const tickets = [];

      // If the ticket from the query is new / or to replace an existing ticket
      let isNewQueryTicket = true;

      // Build new list of tickets from current and query ticket
      tokensParsed.map((tokenParsed) => {
        // If the same as a previous ticket - replace with the new ticket
        if (tokenParsed.ticket.ticketId === ticketFromQueryParsed.ticket.ticketId) {
          tickets.push(ticketFromQueryParsed);
          isNewQueryTicket = false;
        } else {
          tickets.push(tokenParsed);
        }
      });

      // Add ticket if new
      if (isNewQueryTicket) {
        tickets.push(ticketFromQueryParsed);
      }

      // Set New tokens list
      localStorage.setItem('dcTokens', JSON.stringify(tickets));
    }

    // Get New tokens list (with possible new addition)
    const newStorageTokens = localStorage.getItem('dcTokens');

    if (newStorageTokens) {
      // return web friendly data for webster (ticket only)
      return JSON.parse(newStorageTokens).map((token) => {
        if (typeof (token) === 'string') return JSON.parse(token).ticket;
        else return token.ticket;
      });
    } else {
      // No tickets
      return [];
    }

  }
}