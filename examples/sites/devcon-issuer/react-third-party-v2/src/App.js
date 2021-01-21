// import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { Negotiator, Authenticator } from './TokenScript';
import LogoCard from './LogoCard';
import RoomCard from './RoomCard';
import TokenCard from './TokenCard';
import Typography from '@material-ui/core/Typography';
// import roomTypesData from './roomTypesDataMock.json';
import './App.css';

function App() {
  // let web3 = new Web3('HTTP://127.0.0.1:7545');
  // Instantiate an instance of the Negotiator with chosen filters
  const negotiator = new Negotiator();
  // Devcon Tickets (local state).
  let [tokens, setTokens] = useState([]);
  // When tickets are known to exist.
  let [discountAvailable, setDiscountAvailable] = useState(false);
  // Room Types Data
  let [roomTypesData, setRoomTypesData] = useState([]);
  // Selected token instance to apply discount, with the discount value.
  // this comes from a local mock in this example, see: applyDiscount() below.
  let [discount, setDiscount] = useState({ value: undefined, tokenInstance: null });
  // Mock Iframe to read Tickets, this should be devcon.org etc.
  const iframe = () => { return { __html: '<iframe id="test" src="/demo.html" title="Iframe"></iframe>' } };
  // To switch out to use
  // const iframe = () => { return { __html: '<iframe id="tickets-site" src="https://devcontickets.herokuapp.com/" title="Iframe"></iframe>' } };
  // Listen to Tickets being recieved event.
  // Once the event triggers, React will re-render with the tickets.
  window.document.addEventListener('ticketsRecievedEvent', handleEvent, false)
  function handleEvent(e) {
    setDiscountAvailable(true);
    setTokens(e.detail)
  };
  // Select Ticket to apply a view change, showing the discount that can be redeemed.
  const getRoomTypesData = async () => {
    // Local mock can be used if required: roomTypesDataMock.json
    const roomTypesEndpoint = await fetch('http://bogotabackend.herokuapp.com/');
    return roomTypesEndpoint.json();
  }
  useEffect(() => {
    getRoomTypesData().then((data) => {
      setRoomTypesData(data);
    })
  }, []);
  const applyDiscount = async (ticket) => {
    const response = await fetch(`./roomTypesTicketClassDataMock${ticket.ticketClass}.json`)
    const data = await response.json();
    setDiscount({ value: data.discount, tokenInstance: ticket });

    // To review steps.
    // Initial steps
    // // 5. attestation is triggered
    // const useTicketProof = await Authenticator.getAuthenticationBlob({ ticket });
    // // 6. get Challenge
    // const challenge = await Authenticator.fetchChallenge();
    // // 7. sign Challenge useTicketProof, challenge
    // const signedMsg = await Authenticator.signChallenge({ useTicketProof, challenge });
    // // 8. post signed message
    // const sentChallenge = await Authenticator.sendChallenge({ signedMsg });

    // Notes from Oleh
    // const useDevconTicket = await Authenticator.getAuthenticationBlob({ ticket });
    // webster sign useDevconTicket with metamask and send it to the smartContract
    // const signedTicket = await Authenticator.signToken(useDevconTicket);
    // for bogota example: I will add Authenticator method to sign ticket with Metamask and return result object. and you can send that object to the backend for autorization+dicounted checkout.
    // const checkout = this.backendRequestForCheckoutWithDiscount(product, signedTicket);
  }
  // End user has selected to make the booking.
  const book = async (form) => {
    console.log('form data:', form);
    // const response = await fetch(`./roomTypesTicketClassDataMock${ticket.ticketClass}.json`)
    // const data = await response.json();
    // setDiscount({ value: data.discount, tokenInstance: ticket });
    // Book e.g. open paypal, metamask. 
  }
  return (
    <div>
      <LogoCard title={"Hotel Bogota"} />
      <div style={{ position: 'absolute', top: '0px', right: '20px' }}>
        {tokens.length > 0 &&
          <TokenCard tokensNumber={tokens.length} />
        }
      </div>
      <div className="iframeAttestation" dangerouslySetInnerHTML={iframe()} />
      <div className="roomCardsContainer">
        {roomTypesData.map((room, index) => {
          return <RoomCard key={index} room={room} applyDiscount={applyDiscount} discountAvailable={discountAvailable} discount={discount} tokens={tokens} book={book} />
        })}
      </div>
      {discount.value &&
        <div>
          <div className="ethScale">
            <div id="space">
              <div className="elogo">
                <div className="trif u1"></div>
                <div className="trif u2"></div>
                <div className="trif u3"></div>
                <div className="trif u4"></div>
                <div className="ct"></div>
                <div className="trif l1"></div>
                <div className="trif l4"></div>
              </div>
            </div>
          </div>
          <Typography className="applyDiscountCopyContainer" gutterBottom variant="body2" component="p">
            Devcon discount of {discount.value}% has been granted towards your booking! Enjoy the event.
          </Typography>
        </div>
      }
    </div>
  );
}

export default App;
