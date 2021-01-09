import React, { useState, useEffect } from 'react';
import { Negotiator, Authenticator } from './TokenScript';
import Web3 from 'web3';
import LogoCard from './LogoCard';
import RoomCard from './RoomCard';
import DiscountButton from './DiscountButton';
import Typography from '@material-ui/core/Typography';
import roomTypesData from './roomTypesDataMock.json';
import './App.css';

// 1. user opens site and clicks apply discount
// 2. the user selects a ticket from (the iframe?)
// 2. we fetch challenge
// 3. sign challenge
// 4. fetch again with signed message for access to page / discount

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
  const applyDiscount = (event) => {

    // To confirm this flow is correct:
    // 1. IFRAME to select ticket
    // 2. Authenticator.getAuthenticationBlob(ticket)
    // 3. const transactionPayload = [candidateId, ticketProof];
    // 4. contractABI('discount');
    // 5. const transaction = discount.call({ gas, from, to });
    // 6. web3.tx.send();

    // const challenge = await Authenticator.fetchChallenge();
    // const signChallenge = await Authenticator.signChallenge();
    // const sentChallenge = await Authenticator.sendChallenge();

    // on success
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
