import React, { useState, useEffect } from 'react';
import { Negotiator } from './TokenScript';
import Web3 from 'web3';
import LogoCard from './LogoCard';
import RoomCard from './RoomCard';
import DiscountButton from './DiscountButton';
import Typography from '@material-ui/core/Typography';
import './App.css';

const roomTypesData = [
  {
    type: 'Deluxe Room',
    price: '500',
    frequency: 'per night',
    discountPrice: '300',
    image: './hotel_3.jpg'
  },
  {
    type: 'King Suite',
    price: '1000',
    frequency: 'per night',
    discountPrice: '900',
    image: './hotel_2.png'
  },
  {
    type: 'Superior Deluxe Suite',
    price: '5500',
    frequency: 'per night',
    discountPrice: '3950',
    image: './hotel_1.jpg'
  }
]

function App() {
  // Connect to Ganache
  let web3 = new Web3('HTTP://127.0.0.1:7545');
  // local State: tokens[], setTokens: Method to update the state of tokens.
  let [tokens, setTokens] = useState([]);
  let [discountApplied, setDiscountApplied] = useState(false);
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
  const applyDiscount = () => {
    setDiscountApplied(true);
  }
  return (
    <div>
      <LogoCard title={"Hotel Bogota"} />
      <div style={{ flexWrap: 'wrap', display: 'flex', justifyContent: 'center', margin: '60px' }}>
        {roomTypesData.map((room, index) => {
          return <RoomCard key={index} room={room} discountApplied={discountApplied} />
        })}
      </div>
      <div style={{ flexWrap: 'wrap', display: 'flex', justifyContent: 'center' }}>
        <div>
          <Typography style={{ fontSize: "0.9rem", color: "#3f51b5", textAlign: "center" }} gutterBottom variant="body2" component="p">
            Do you have a Devcon VI ticket?
          </Typography>
          <div style={{ flexWrap: 'wrap', display: 'flex', justifyContent: 'center' }}>
            <DiscountButton applyDiscount={applyDiscount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
