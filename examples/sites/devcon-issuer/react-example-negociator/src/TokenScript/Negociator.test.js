import { Negociator } from './Negociator';

test('Negociator provides the correctly given filters', () => {
  const negociator = new Negociator(["tickets", "expiry > today"]);
  expect(negociator.filter).toEqual(['tickets', 'expiry > today']);
});

test('Negociator provides no tokens', async () => {
  const negociator = new Negociator(["tickets", "expiry > today"]);
  const tickets = await negociator.getTokenInstances();
  expect(tickets).toEqual([]);
});

test('Negociator provides token from local storage', async () => {
  const negociator = new Negociator(["tickets", "expiry > today"]);
  localStorage.setItem('dcTokens', '[{"ticket":{"devconId":"6n","ticketId":"48646n","ticketClass":"0n"},"commitment":{"[Uint8Contents]":"< 04 0a fd f0 e2 47 4c ae 9b 66 16 f0 4b ac dd 9f 76 ab 58 82 db b8 39 9d 3f 60 a1 53 61 da d7 03 0f 27 be 3f 58 3f e4 5d e9 49 5f 84 f4 82 37 ec 2b 7c 71 0e b3 b5 d2 e7 a5 65 2d 8d 56 c7 18 25 6f >","byteLength":65},"signatureValue":{"[Uint8Contents]":"< 30 44 02 20 38 db 21 b6 b5 b7 c6 92 da ad a2 b6 2e bb 89 e5 a3 6e 3a 3c ce 66 1e 38 53 2b c9 ac c8 5c 34 1b 02 20 70 46 73 21 8f 77 b2 47 b5 51 ab 3c 3d 74 e1 ef 8f 4f 7e 3a e0 40 1d 53 54 26 65 3a aa 5e c2 a2 >","byteLength":70}}]');
  const tickets = await negociator.getTokenInstances();
  expect(tickets).toEqual([{ "devconId": "6n", "ticketId": "48646n", "ticketClass": "0n" }]);
});

// TODO's

// 1. Append ticket from url to storage
// 2. Ensure Query string ticket is unique / not appended when the same