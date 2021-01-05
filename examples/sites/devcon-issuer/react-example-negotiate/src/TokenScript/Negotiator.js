
// started to mock out a way to clean the data recieved from the query.
// const privateMethods = {
//   // Remove types from returned
//   removeDataTypes: (ticketData) => {
//     const removeTypeKeyWords = ['SignedDevconTicket', 'DevconTicket', 'ArrayBuffer'];
//     var expStr = removeTypeKeyWords.join("\\b|\\b");
//     var removeTypes = ticketData.replace(new RegExp(expStr, 'gi'), '').trim().replace(/ +/g, '');
//     return removeTypes.substring(1, removeTypes.length - 1);
//   },
//   // format incoming data so it can be parsed into JS
//   cleanString: (ticketData) => {
//     var transformEach = [
//       { from: "[Uint8Contents]", to: "'[Uint8Contents]'" },
//       { from: "<", to: "'<" },
//       { from: ">", to: ">'" },
//     ]
//     transformEach.map(transformObj => {
//       ticketData.replace(new RegExp(transformObj.from, 'gi'), transformObj.to);
//     });
//     return ticketData;
//   }
// }

export class Negotiator {
  constructor(filter) {
    this.filter = filter;
  }

  // Modal / Auto Attestation
  async negotiate() {
    return true;
  }

  // old
  // localhost:3000?ticket={"ticket":{"devconId":"6n","ticketId":"48646n","ticketClass":"0n"},"commitment":{"[Uint8Contents]":"< 04 0a fd f0 e2 47 4c ae 9b 66 16 f0 4b ac dd 9f 76 ab 58 82 db b8 39 9d 3f 60 a1 53 61 da d7 03 0f 27 be 3f 58 3f e4 5d e9 49 5f 84 f4 82 37 ec 2b 7c 71 0e b3 b5 d2 e7 a5 65 2d 8d 56 c7 18 25 6f >","byteLength":65},"signatureValue":{"[Uint8Contents]":"< 30 44 02 20 38 db 21 b6 b5 b7 c6 92 da ad a2 b6 2e bb 89 e5 a3 6e 3a 3c ce 66 1e 38 53 2b c9 ac c8 5c 34 1b 02 20 70 46 73 21 8f 77 b2 47 b5 51 ab 3c 3d 74 e1 ef 8f 4f 7e 3a e0 40 1d 53 54 26 65 3a aa 5e c2 a2 >","byteLength":70}}&secret=3446435555555
  // new
  // localhost:3000?ticket='SignedDevconTicket{ticket: DevconTicket {devconId: 6n,ticketId: 417541561855n,ticketClass: 0n},commitment: ArrayBuffer {[Uint8Contents]: <04 12 35 64 9d 5b fd 29 fe c5 d8 5b 6d e9 05 4e dc 8d 36 79 16 9d 88 4d 64 27 a9 2f af dd f8 fd 30 29 38 b6 71 ae 1e 46 2f 78 cb a0 4c fd 26 fe 36 16 ca 4f bf f2 c7 15 ae 8c f4 06 8e b8 b0 2f 22>,byteLength: 65},publicKeyInfo: PublicKeyInfo { signatureAlgorithm: undefined, publicKey: undefined },signatureValue: ArrayBuffer {[Uint8Contents]: <30 44 02 20 70 2c af bd e4 d3 d9 a3 45 b4 d4 70 c1 7f 26 62 b1 9d 8a 68 da f3 a1 6b b1 45 5f e7 86 31 8b 30 02 20 68 e3 f8 79 55 48 34 7e 71 33 c0 af f4 e5 43 77 23 86 dc 1c 54 ab 23 d5 40 eb 83 53 d3 da 0b da>,byteLength: 70}}'&secret='45845870684'

  // Get the token instances (with filter)
  async getTokenInstances() {

    // Get ticket from params
    const urlParams = new URLSearchParams(window.location.search);
    const ticketFromQuery = urlParams.get('ticket');
    const secretFromQuery = urlParams.get('secret');

    // Get the current Storage Tokens
    const storageTokens = localStorage.getItem('dcTokens');

    // Parse into JS
    let tokensParsed = storageTokens ? JSON.parse(storageTokens) : [];

    // work in progress:

    // Remove types from the string given / without this step JS won't be able to interpret the data when parsed
    const ticketFromQueryNoTypes = privateMethods.removeDataTypes(ticketFromQuery).cleanString(ticketFromQuery);

    debugger;

    // Parse ticket for validation
    const ticketFromQueryParsed = JSON.parse(ticketFromQueryNoTypes);

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
          // Include the secret inside the ticket object
          ticketFromQueryParsed.secret = secretFromQuery;
          tickets.push(ticketFromQueryParsed);
          isNewQueryTicket = false;
        } else {
          tickets.push(tokenParsed);
        }
      });

      // Add ticket if new
      if (isNewQueryTicket) {
        // Include the secret inside the ticket object
        ticketFromQueryParsed.secret = secretFromQuery;
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