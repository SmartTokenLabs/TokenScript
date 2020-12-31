import React, { useState, useEffect } from 'react';
import './App.css';
import { Authenticator, Negociator } from './TokenScript';
import Web3 from 'web3';
import Card from './Card';
import Modal from './Modal';

// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-accounts.html#id15
// https://github.com/ethereumjs/ethereumjs-util

function App() {

  // Connect to Ganache
  let web3 = new Web3('HTTP://127.0.0.1:7545');
  // Tokens, default to []
  // Current local State: tokens, setTokens: Method to update the state of tokens.
  let [tokens, setTokens] = useState([]);

  const negociator = new Negociator(["tickets", "expiry > today"]);

  // // Sign a message
  // const signature = web3.eth.accounts.sign('Some data', '35335e2eac26772c5b1aed0114f7f635b99eb17fe8ef37cd68edd7acf093fa9c');
  // console.log('signature', signature);
  // // Get the Public key of the signed message
  // const addressRecovered = web3.eth.accounts.recover(signature);
  // console.log('signatureRecovered', addressRecovered);

  // API:
  // Negociator.
  // 

  // Negociator.init() - On load of application. Should only be triggered once to get tokens.
  // (Note: this cannot check if there are any new tokens)
  // 

  // 
  selectVIPEventHandler = ({ ticket }) => {
    if (ticket.isValid) {
      const addr = Authenticator.assetOwnerAddress(ticket);
      if (addr == web3.defaultAccount.address) {
        // get a challenge
        fetch('/challenge.json')
        // Sign the challenge
        const signature = web3.eth.accounts.sign('Some data', '35335e2eac26772c5b1aed0114f7f635b99eb17fe8ef37cd68edd7acf093fa9c');
        console.log('signature', signature);
        // post the signature to server then(success){
        // Enter VIP Room
        // }
      }
    }
    // 2. if valid, 
  }

  useEffect(() => {
    negociator.negociate().then(status => {
      // Onload of Component, get tokens.
      negociator.getTokenInstances().then((tokens) => {
        // React event to update state of tokens, causes component to re-render (show the tokens).
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
