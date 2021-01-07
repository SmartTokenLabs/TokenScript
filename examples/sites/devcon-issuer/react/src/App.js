import React, { useState, useEffect } from 'react';
import { Negotiator } from './TokenScript';
import Web3 from 'web3';
import Card from './Card';
import Modal from './Modal';
import './App.css';

function App() {
  // Connect to Ganache
  let web3 = new Web3('HTTP://127.0.0.1:7545');
  // local State: tokens[], setTokens: Method to update the state of tokens.
  let [tokens, setTokens] = useState([]);
  // instantiate singleton instance using SQL style filters
  const negotiator = new Negotiator(
    [
      "tickets",
      "expiry > today"
    ]
  );
  useEffect(() => {
    // to confirm the task of negotiate() in comparison to getTokenInstances()
    negotiator.negotiate().then(status => {
      // onload of component, get tokens.
      negotiator.getTokenInstances().then((tokens) => {
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
