import React, { useState, useEffect } from 'react';
import { Authenticator, Negociator } from './TokenScript';
import Web3 from 'web3';
import Card from './Card';
import Modal from './Modal';
import ContractMock from './TokenScript/contractMock';
import './App.css';

// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-accounts.html#id15
// https://github.com/ethereumjs/ethereumjs-util

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
  // End user selected a VIP ticket from the UI
  const selectVIPEventHandler = ({ ticket }) => {
    if (ticket.isValid) {
      const addr = Authenticator.assetOwnerAddress(ticket);
      if (addr == web3.defaultAccount.address) {
        // get a challenge fetch('/challenge.json'); 
        // To confirm, a: is this challenge custom to the application, b: or common for 
        // the tokenscript library.
        // a. Fetch can be done here.
        // b. Fetch can be wrapped so the developer doesn't need to see the inner workings etc. 
        ContractMock.challenge().then((challenge) => {
          // Sign the challenge
          const signature = web3.eth.accounts.sign(challenge, '35335e2eac26772c5b1aed0114f7f635b99eb17fe8ef37cd68edd7acf093fa9c');
          console.log('signature', signature);
          // post the signature to server then(success){
          // Enter VIP Room
          // });
        });
      }
    }
  }
  useEffect(() => {
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
          return <Card key={index} tokenInstance={tokenInstance} selectVIPEventHandler={selectVIPEventHandler} />
        })
        }
      </div>
    </div>
  );
}

export default App;
