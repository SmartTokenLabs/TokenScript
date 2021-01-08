// https://github.com/TokenScript/attestation/blob/main/src/main/javascript/SignedDevonTicket.js
import { SignedDevconTicket } from './../Attestation/SignedDevonTicket';
import { generateKey, encrypt, pack, unpack, decrypt } from './Crypto';

export class Negotiator {
  constructor(filter) {
    this.filter = filter;
  }

  // Modal / Auto Attestation
  async negotiate() {
    return true;
  }

  async negotiate() {
    return true;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
  // Example of how to decrypt the secret
  async getTokenSecret(ticket, ticketKey) {
    const encryptedSecretObject = JSON.parse(ticket.secret);
    const secret = await decrypt(unpack(encryptedSecretObject.cipher), ticketKey, unpack(encryptedSecretObject.iv));
    return secret;
  }

  // Get the token instances (with filter)
  async getTokenInstances() {
    // Get ticket from params - to add to local storage / read into app
    const urlParams = new URLSearchParams(window.location.search);
    const ticketFromQuery = urlParams.get('ticket');
    const secretFromQuery = urlParams.get('secret');

    // Encrypt the secret
    const ticketKey = await generateKey();
    const { cipher, iv } = await encrypt(secretFromQuery, ticketKey);
    const encryptedSecret = JSON.stringify({
      cipher: pack(cipher),
      iv: pack(iv),
    });

    // Get the current Storage Tokens (DER format)
    const storageTickets = localStorage.getItem('dcTokens');
    // Decode the current ticket (DER format)
    // root object { commitment, publicKeyInfo, signatureValue, ticket } 
    // ticket example: "SignedDevconTicket{ticket: DevconTicket {devconId: 6n,ticketId: 417541561855n,ticketClass: 0n},commitment: ArrayBuffer {[Uint8Contents]: <04 12 35 64 9d 5b fd 29 fe c5 d8 5b 6d e9 05 4e dc 8d 36 79 16 9d 88 4d 64 27 a9 2f af dd f8 fd 30 29 38 b6 71 ae 1e 46 2f 78 cb a0 4c fd 26 fe 36 16 ca 4f bf f2 c7 15 ae 8c f4 06 8e b8 b0 2f 22>,byteLength: 65},publicKeyInfo: PublicKeyInfo { signatureAlgorithm: undefined, publicKey: undefined },signatureValue: ArrayBuffer {[Uint8Contents]: <30 44 02 20 70 2c af bd e4 d3 d9 a3 45 b4 d4 70 c1 7f 26 62 b1 9d 8a 68 da f3 a1 6b b1 45 5f e7 86 31 8b 30 02 20 68 e3 f8 79 55 48 34 7e 71 33 c0 af f4 e5 43 77 23 86 dc 1c 54 ab 23 d5 40 eb 83 53 d3 da 0b da>,byteLength: 70}}'";
    let ticketDecodedString;
    let ticketObject = {};
    if (ticketFromQuery) {
      ticketDecodedString = new SignedDevconTicket(ticketFromQuery);
      // Read from Decoded ticket String
      ticketObject = ticketDecodedString.ticket;
    }
    // Check if the ticket is valid (has data)
    const isValidTicket = (
      ticketObject.ticketId,
      ticketObject.ticketClass,
      ticketObject.devconId
    );
    // Tickets for storage (raw) and for web view
    const tickets = {
      raw: [],
      web: []
    };
    // If Valid, return web friendly tickets
    if (isValidTicket) {
      // Check if its new or an existing ticket id:
      // If the ticket from the query is new / or to replace an existing ticket
      let isNewQueryTicket = true;
      if (storageTickets && storageTickets.length) {
        // Build new list of tickets from current and query ticket { ticket, secret }
        JSON.parse(storageTickets).map((ticketBlob) => {
          // Decoded string to JS Object
          const storedTicketObject = new SignedDevconTicket(ticketBlob.ticket);
          // If the same as a previous ticket - replace with the new ticket
          if (storedTicketObject.ticket.ticketId == ticketObject.ticketId) {
            // If new push the DER of the ticket into localstorage
            tickets.raw.push({ ticket: ticketFromQuery, secret: encryptedSecret });
            // Push a js object
            tickets.web.push({
              devconId: ticketObject.devconId.toString(),
              ticketId: ticketObject.ticketId.toString(),
              ticketClass: ticketObject.ticketClass.toString()
            });
            isNewQueryTicket = false;
          } else {
            // Else push the original DER - Check this is correct.
            tickets.raw.push(ticketBlob); // contains the ticket and secret
            tickets.web.push({
              devconId: storedTicketObject.ticket.devconId.toString(),
              ticketId: storedTicketObject.ticket.ticketId.toString(),
              ticketClass: storedTicketObject.ticket.ticketClass.toString()
            });
          }
        });
      }
      // Add ticket if new
      if (isNewQueryTicket) {
        tickets.raw.push({ ticket: ticketFromQuery, secret: encryptedSecret }); // new raw object
        tickets.web.push({
          devconId: ticketObject.devconId.toString(),
          ticketId: ticketObject.ticketId.toString(),
          ticketClass: ticketObject.ticketClass.toString()
        });
      }
      // Set New tokens list raw only, websters will be decoded each time
      localStorage.setItem('dcTokens', JSON.stringify(tickets.raw));
    } else { // no ticket in browser window, search for localstorage items
      if (storageTickets && storageTickets.length) {
        JSON.parse(storageTickets).map((ticketBlob) => {
          // Decoded string to JS Object
          const storedTicketObject = new SignedDevconTicket(ticketBlob.ticket);
          // Push the original DER
          tickets.raw.push(ticketBlob);
          tickets.web.push({
            devconId: storedTicketObject.ticket.devconId.toString(),
            ticketId: storedTicketObject.ticket.ticketId.toString(),
            ticketClass: storedTicketObject.ticket.ticketClass.toString()
          });
        });
      }
    }

    await this.getTokenSecret(tickets.raw[0], ticketKey);

    // Return tickets for web
    return tickets.web;
  }
}