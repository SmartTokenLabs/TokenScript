# example 

## Developer Getting Started

1. From this directory, run `yarn` or `npm install`
2. To start the development server run `yarn start`
3. To see the development server running go to localhost:3000
4. To simulate a ticket loading inside the page, open the url below:

````
http://localhost:3000/?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684

````

5. To build the applicatin run `yarn build`
6. To test the application run `yarn test`

### Latest structures

````

https://ticket.devcon.org/?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684

http://localhost:3000/?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684

````

### Latest stucture (decoded version)

````

localhost:3000?ticket=SignedDevconTicket{ticket: DevconTicket {devconId: 6n,ticketId: 417541561855n,ticketClass: 0n},commitment: ArrayBuffer {[Uint8Contents]: <04 12 35 64 9d 5b fd 29 fe c5 d8 5b 6d e9 05 4e dc 8d 36 79 16 9d 88 4d 64 27 a9 2f af dd f8 fd 30 29 38 b6 71 ae 1e 46 2f 78 cb a0 4c fd 26 fe 36 16 ca 4f bf f2 c7 15 ae 8c f4 06 8e b8 b0 2f 22>,byteLength: 65},publicKeyInfo: PublicKeyInfo { signatureAlgorithm: undefined, publicKey: undefined },signatureValue: ArrayBuffer {[Uint8Contents]: <30 44 02 20 70 2c af bd e4 d3 d9 a3 45 b4 d4 70 c1 7f 26 62 b1 9d 8a 68 da f3 a1 6b b1 45 5f e7 86 31 8b 30 02 20 68 e3 f8 79 55 48 34 7e 71 33 c0 af f4 e5 43 77 23 86 dc 1c 54 ab 23 d5 40 eb 83 53 d3 da 0b da>,byteLength: 70}}&secret=45845870684

````

### old structure

````

localhost:3000?ticket={"ticket":{"devconId":"6n","ticketId":"48646n","ticketClass":"0n"},"commitment":{"[Uint8Contents]":"< 04 0a fd f0 e2 47 4c ae 9b 66 16 f0 4b ac dd 9f 76 ab 58 82 db b8 39 9d 3f 60 a1 53 61 da d7 03 0f 27 be 3f 58 3f e4 5d e9 49 5f 84 f4 82 37 ec 2b 7c 71 0e b3 b5 d2 e7 a5 65 2d 8d 56 c7 18 25 6f >","byteLength":65},"signatureValue":{"[Uint8Contents]":"< 30 44 02 20 38 db 21 b6 b5 b7 c6 92 da ad a2 b6 2e bb 89 e5 a3 6e 3a 3c ce 66 1e 38 53 2b c9 ac c8 5c 34 1b 02 20 70 46 73 21 8f 77 b2 47 b5 51 ab 3c 3d 74 e1 ef 8f 4f 7e 3a e0 40 1d 53 54 26 65 3a aa 5e c2 a2 >","byteLength":70}}&secret=3446435555555

````

## Notes from meeting with Weiwu

1. Update the ticket data to manage both tickets and a secret [{secret, ticket}]
   
   - Dev note: Upon creating a new ticket / updating an previous ticket, the secret is added within  the js structure.

2. Update the query to provide the encoded version
3. Add github to package.json for attestation lib 

````
  https://ticket.devcon.org/?ticket=MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=&secret=45845870684

  ticketObject: {
    ticket: MIGbMA0CAQYCBWE3ap3-AgEABEEEEjVknVv9Kf7F2Ftt6QVO3I02eRadiE1kJ6kvr934-TApOLZxrh5GL3jLoEz9Jv42FspPv-LHFa6M9AaOuLAvIgNHADBEAiBwLK_95NPZo0W01HDBfyZisZ2KaNrzoWuxRV-nhjGLMAIgaOP4eVVINH5xM8Cv9OVDdyOG3BxUqyPVQOuDU9PaC9o=,
    secret: 45845870684
  }
````

## future ideas

````

// Passive Event Management - todo, work out strategy for this.
const event = new Event('tokenEvent');
// Listen for the event.
window.addEventListener('tokenEvent', function (e) { console.log('e') }, false);
// Dispatch the event.
window.dispatchEvent(event);

````

## dev resources and previous notes

- resources:

https://web3js.readthedocs.io/en/v1.2.0/web3-eth-accounts.html#id15
https://github.com/ethereumjs/ethereumjs-util

- Todo's:

1. Localstorage / query string simulation (must review flow with Weiwu) (done)
2. React & Vanilla JS-Html (modern and traditional approaches etc) (react done / vanilla todo once confirmed the react is correct)
3. NPM & Dist (modern and traditional approaches etc) (todo)

// 2 and 3 are perhaps nice to have for Devcon (however my aim is to provide both)

// Attestation Github (Git or NPM code in here)
// Negotiator Github (needs to consume the Attestation Git or NPM code)
// Nick-T to utilise this: username/repo#branch-name

# react specifics below

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
