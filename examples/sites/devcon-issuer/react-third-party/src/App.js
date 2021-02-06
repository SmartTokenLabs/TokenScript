import React, { useState, useEffect } from 'react';
import LogoCard from './LogoCard';
import RoomCard from './RoomCard';
import TokenNotificationCard from './TokenNotificationCard';
import Typography from '@material-ui/core/Typography';
import EthereumLogo from './EthereumLogo';
import BookingDate from './BookingDate';
import './App.css';

function App() {

  // React state hooks

  // Devcon Tickets
  let [tokens, setTokens] = useState([]);

  // Devcon non-discount offers
  let [freeShuttle, setFreeShuttle] = useState(false);

  // Room Types Data
  let [roomTypesData, setRoomTypesData] = useState([]);

  // Selected token instance to apply discount, with the discount value.
  let [discount, setDiscount] = useState({ value: undefined, tokenInstance: null });

  // Negotiator

  // Instantiate an instance of the Negotiator with chosen filters
  // let negotiator = new Negotiator({}, {
  //   debug: 1,
  //   tokensOrigin: "https://devcontickets.herokuapp.com/",
  //   hideTokensIframe: true
  // });

  let tokensURL = "https://devcontickets.herokuapp.com/outlet/";
  let filter = { 'ticketClass': 1 };
  // let filter = { };
  let negotiator = new Negotiator(
    filter
    // "https://devcontickets.herokuapp.com/outlet/" hardcoded as default value, we can change it if needed
    // , {tokensOrigin: tokensURL}
  );

  // Booking and Hotel Specific Events

  // Select Ticket to apply a view change, showing the discount that can be redeemed.
  const getRoomTypesData = async () => {
    try {
      const roomTypesEndpoint = await fetch('http://bogotabackend.herokuapp.com/');
      return roomTypesEndpoint.json();
    } catch (e) {
      throw e;
    }
  }

  // Apply discount, user selected a ticket
  const applyDiscount = async (ticket) => {
    try {
      const response = await fetch(`./roomTypesTicketClassDataMock${ticket.ticketClass.toString()}.json`)
      const data = await response.json();
      setDiscount({ value: data.discount, tokenInstance: ticket });
    } catch (e) {
      throw e;
    }
  }

  // User selects to make the booking
  const book = async (form) => {
    console.log('form data:', form);

    // To confirm this flow:
    // const useDevconTicket = await Authenticator.getAuthenticationBlob({ ticket });
    // webster sign useDevconTicket with metamask and send it to the smartContract
    // const signedTicket = await Authenticator.signToken(useDevconTicket);
    // for bogota example: I will add Authenticator method to sign ticket with Metamask and return result object. and you can send that object to the backend for autorization+dicounted checkout.
    // const checkout = this.backendRequestForCheckoutWithDiscount(product, signedTicket);

    // discount object with ticket inside:
    // console.log(discount);

    // let base64ticket = "MIGXMAkCAQYCAW8CAQAEQQQvZiRvuwETD_9d_eDp_4b0o0caeQ9FZ7e8hsxMi7SNsx-xkbfqtaNONRXQzQ1wO95bOVk3BRSdbQBNVLox62pCA0cAMEQCIFavePjptmgxBsVuHp7bZSDxK0ovB8d9URp2VjiGos56AiA9apKTL6Kk74Jgf2H7Mb4EZqlsdwJLXSN23sC6aoRyKg==";
    // let ticketSecret = 45845870611;

    // const authenticator = new Authenticator();

    // debugger;

    // authenticator.getAuthenticationBlob({
    //   ticketBlob: base64ticket,
    //   ticketSecret: ticketSecret,
    //   attestationOrigin: 'https://stage.attestation.id/',
    // }, useDevconTicket => {
    //   console.log('success');
    //   console.log(useDevconTicket);
    //   // writeToLog('useDevconTicket received (in hex ): ' + useDevconTicket);
    //   debugger;
    // }, (err) => {
    //   console.log('fail', err);
    // });
  }

  // React effects
  useEffect(() => {
    // Get tokens with applied filter
    negotiator.negotiate(data => {
      setTokens(data.tokens);
      // apply any upfront discounts
      data.tokens.map(token => {
        setFreeShuttle(true);
      });
    });
    // Get mock rooms data
    getRoomTypesData().then((data) => {
      setRoomTypesData(data);
    })
  }, []);

  return (
    <div>
      <LogoCard title={"Hotel Bogota"} />
      <div style={{ position: 'absolute', top: '0px', right: '20px' }}>
        {tokens.length > 0 &&
          <TokenNotificationCard tokensNumber={tokens.length} />
        }
      </div>
      <BookingDate />
      <div className="roomCardsContainer">
        {roomTypesData.map((room, index) => {
          return <RoomCard
            key={index}
            room={room}
            applyDiscount={applyDiscount}
            discount={discount}
            tokens={tokens}
            book={book}
          />
        })}
      </div>
      {
        freeShuttle &&
        <div>
          <EthereumLogo />
          <Typography
            style={{ padding: '20px' }}
            className="applyDiscountCopyContainer"
            gutterBottom
            variant="body2"
            component="p">
            Free shuttle service available as a Devcon Ticket holder! Enjoy the event.
          </Typography>
        </div>
      }
    </div>
  );
}

export default App;
