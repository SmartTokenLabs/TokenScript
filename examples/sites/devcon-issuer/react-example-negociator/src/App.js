import React, { useState, useEffect } from 'react';
import { Negociator } from './TokenScript';
import Web3 from 'web3';
import Card from './Card';
import Modal from './Modal';
import './App.css';

// For testing (copy this into the url):
// // { token: { ticketId: 15, ticketClass: "VIP", conferenceId: 3, isValid: true }, ownerAddress: 2 }
// localhost:3000?ticket={"ticket":{"devconId":"6n","ticketId":"48646n","ticketClass":"0n"},"commitment":{"[Uint8Contents]":"< 04 0a fd f0 e2 47 4c ae 9b 66 16 f0 4b ac dd 9f 76 ab 58 82 db b8 39 9d 3f 60 a1 53 61 da d7 03 0f 27 be 3f 58 3f e4 5d e9 49 5f 84 f4 82 37 ec 2b 7c 71 0e b3 b5 d2 e7 a5 65 2d 8d 56 c7 18 25 6f >","byteLength":65},"signatureValue":{"[Uint8Contents]":"< 30 44 02 20 38 db 21 b6 b5 b7 c6 92 da ad a2 b6 2e bb 89 e5 a3 6e 3a 3c ce 66 1e 38 53 2b c9 ac c8 5c 34 1b 02 20 70 46 73 21 8f 77 b2 47 b5 51 ab 3c 3d 74 e1 ef 8f 4f 7e 3a e0 40 1d 53 54 26 65 3a aa 5e c2 a2 >","byteLength":70}}

function App() {

  // Connect to Ganache
  let web3 = new Web3('HTTP://127.0.0.1:7545');
  // local State: tokens[], setTokens: Method to update the state of tokens.
  let [tokens, setTokens] = useState([]);
  // instantiate singleton instance using SQL style filters
  const negociator = new Negociator(
    [
      "tickets",
      "expiry > today"
    ]
  );
  useEffect(() => {

    // 1. onload of page, read from query string
    // 2. store the data into Local Storage [ticket, ticket, ticket]
    // 3. webster uses an API method to pull down the tickets, { friendly JSON }
    // 4. webster loads the data into Front End Stylised web page

    negociator.negociate().then(status => {
      // onload of component, get tokens.
      negociator.getTokenInstances().then((tokens) => {
        // react event to update state of tokens, component re-renders to show the latest tokens.
        setTokens(tokens);
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }, []);
  return (
    <div>
      <Modal></Modal>
      <div style={{ flexWrap: 'wrap', display: 'flex', justifyContent: 'center', margin: '60px' }}>
        {tokens.length > 0 && tokens.map((tokenInstance, index) => {
          return <Card key={index} tokenInstance={tokenInstance} />
        })
        }
      </div>
    </div>
  );
}

export default App;
