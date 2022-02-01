import { Negotiator } from './Negotiator';

test('Negotiator provides the correctly given filters', () => {
  localStorage.setItem('dcTokens', '[]');
  const negotiator = new Negotiator(["tickets", "expiry > today"]);
  expect(negotiator.filter).toEqual(['tickets', 'expiry > today']);
});

// code implementation before using the full signed ticket att method
// test('Negotiator provides token from local storage', async () => {
//   localStorage.setItem('dcTokens', '[]');
//   const negotiator = new Negotiator(["tickets", "expiry > today"]);
//   var ticketStored = '[{"ticket":"MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=","secret":"45845870684"}]';
//   localStorage.setItem('dcTokens', ticketStored);
//   const tickets = await negotiator.getTokenInstances();
//   expect(tickets).toEqual([{ "devconId": "6n", "ticketId": "48646n", "ticketClass": "0n" }]);
// });

// test('Negotiator, ensure Query string ticket can be added', async () => {
//   window.history.pushState({}, 'Test Title', '?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684');
//   const negotiator = new Negotiator(["tickets", "expiry > today"]);
//   const tickets = await negotiator.getTokenInstances();
//   expect(tickets).toEqual([
//     { "devconId": "6n", "ticketId": "417541561855n", "ticketClass": "0n" }
//   ]);
// })

// test('Negotiator, add two tickets', async () => {
//   localStorage.setItem('dcTokens', '[]');
//   window.history.pushState({}, 'Test Title', '?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684');
//   const negotiator = new Negotiator(["tickets", "expiry > today"]);
//   const tickets = await negotiator.getTokenInstances();
//   expect(tickets).toEqual([
//     { "devconId": "6n", "ticketId": "417541561855n", "ticketClass": "0n" },
//   ]);
//   window.history.pushState({}, 'Test Title', '?ticket="SignedDevconTicket{ticket: DevconTicket {devconId: 2n,ticketId: 117541561855n,ticketClass: 2n},commitment: ArrayBuffer {[Uint8Contents]: <04 12 35 64 9d 5b fd 29 fe c5 d8 5b 6d e9 05 4e dc 8d 36 79 16 9d 88 4d 64 27 a9 2f af dd f8 fd 30 29 38 b6 71 ae 1e 46 2f 78 cb a0 4c fd 26 fe 36 16 ca 4f bf f2 c7 15 ae 8c f4 06 8e b8 b0 2f 22>,byteLength: 65},publicKeyInfo: PublicKeyInfo { signatureAlgorithm: undefined, publicKey: undefined },signatureValue: ArrayBuffer {[Uint8Contents]: <30 44 02 20 70 2c af bd e4 d3 d9 a3 45 b4 d4 70 c1 7f 26 62 b1 9d 8a 68 da f3 a1 6b b1 45 5f e7 86 31 8b 30 02 20 68 e3 f8 79 55 48 34 7e 71 33 c0 af f4 e5 43 77 23 86 dc 1c 54 ab 23 d5 40 eb 83 53 d3 da 0b da>,byteLength: 70}}&secret=45845870684"');
//   const ticketAdded = await negotiator.getTokenInstances();
//   expect(ticketAdded).toEqual([
//     {
//       "devconId": "2n",
//       "ticketClass": "2n",
//       "ticketId": "117541561855n",
//     },
//     {
//       "devconId": "6n",
//       "ticketClass": "0n",
//       "ticketId": "417541561855n",
//     },
//   ]);
// })

// test('Negotiator, ensure ticket is not appended when the same', async () => {
//   localStorage.setItem('dcTokens', '[]');
//   window.history.pushState({}, 'Test Title', '?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684');
//   const negotiator = new Negotiator(["tickets", "expiry > today"]);
//   const tickets = await negotiator.getTokenInstances();
//   expect(tickets).toEqual([
//     { "devconId": "6n", "ticketId": "417541561855n", "ticketClass": "0n" },
//   ]);
//   window.history.pushState({}, 'Test Title', '?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684');
//   const ticketAdded = await negotiator.getTokenInstances();
//   expect(ticketAdded).toEqual([
//     {
//       "devconId": "6n",
//       "ticketClass": "0n",
//       "ticketId": "417541561855n"
//     }
//   ]);
// })
