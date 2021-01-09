import React, { useState, useEffect } from 'react';
import { Negotiator } from './TokenScript';
import Web3 from 'web3';
import LogoCard from './LogoCard';
import RoomCard from './RoomCard';
import DiscountButton from './DiscountButton';
import Typography from '@material-ui/core/Typography';
import roomTypesData from './roomTypesDataMock.json';
import './App.css';

function App() {
  // let web3 = new Web3('HTTP://127.0.0.1:7545');
  // let [tokens, setTokens] = useState([]);
  // const negotiator = new Negotiator(
  //   [
  //     "tickets",
  //     "expiry > today"
  //   ]
  // );
  // useEffect(() => {}, []);
  let [discountApplied, setDiscountApplied] = useState(false);
  const applyDiscount = () => {
    setDiscountApplied(true);
  }
  return (
    <div>
      <LogoCard title={"Hotel Bogota"} />
      <div className="roomCardsContainer">
        {roomTypesData.map((room, index) => {
          return <RoomCard key={index} room={room} discountApplied={discountApplied} />
        })}
      </div>
      <div className="discountOptionContainer">
        <div>
          <Typography className="discountCopyContainer" gutterBottom variant="body2" component="p">
            Do you have a Devcon VI ticket?
          </Typography>
          <div className="discountButtonContainer">
            <DiscountButton applyDiscount={applyDiscount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
