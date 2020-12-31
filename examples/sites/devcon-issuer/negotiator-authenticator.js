
// Mock value
const currentUser = {
    ownerAddress: 2
};

let tokenMock = [
    { token: { ticketId: 42, ticketClass: "VIP", conferenceId: 1 }, ownerAddress: null },
    { token: { ticketId: 32, ticketClass: "STANDARD", conferenceId: 2 }, ownerAddress: 2 },
    { token: { ticketId: 15, ticketClass: "VIP", conferenceId: 3 }, ownerAddress: 2 },
];

// Negotiator Module
const Negotiator = {
    getTokenInstances: function async() { return tokenMock }
};

// Authenticator Module
const Authenticator = {
    authenticateAddress: async function (ownerAddress) {
        return true;
    },
    assetOwnerAddress: async function () {
        tokenMock[0].token.ownerAddress = 2;
        return tokenMock[0].token.ownerAddress;
    },
    authenticate: async function () {
        return "Authenticated"
    }
};

// Helper for success and failed promises
// negotiatorAuthenticator code 
const asyncHelper = async (promise) => {
    try {
        const data = await promise;
        return [data, undefined];
    } catch (error) {
        return [undefined, error];
    }
}

const handlerSubmit = (event) => {
    event.preventDefault();
    Authenticator.assetOwnerAddress(event.currentTarget[0].value).then(function (result) {
        // sequence of steps to trigger...
        // authenticateAddress(ownerAddress)
        // authenticate(chosenTicket)
        // Close Modal, provide permission to VIP Room
        document.getElementById("modal").style.display = 'none';
        alert('user can enter the VIP room');
    }, function (error) {
        // handle error
    });
}

const negotiatorAuthenticator = {};

negotiatorAuthenticator.init = async () => {
    // 1. Get most up to date Tokens
    const [tokens, tokensErr] = await asyncHelper(Negotiator.getTokenInstances());
    if (tokensErr) return negotiatorAuthenticator.errorHandler("Could not resolve token instances");
    // 2. Return tokens
    return tokens;
}
// emulates the modal process
negotiatorAuthenticator.assetOwnerAddress = (chosenTicket) => {
    // Open Modal Process Here to confirm via email
    // 4. Render the tickets inside the vip-tickets-list
    document.getElementById("modal-inner-content").innerHTML = `
        <form onSubmit="handlerSubmit(event)">
            <label for="email">Please enter your email Address:</label><br>
            <input type="text" id="email" name="email" value="test@test.com" style="margin: 12px 0"><br>
            <input type="submit" value="Submit">
        </form>
    `;
    // 5. Show Modal
    document.getElementById("modal").style.display = 'block';
}
negotiatorAuthenticator.authenticateAddress = async (ownerAddress) => {
    const [address, addressErr] = await asyncHelper(Authenticator.authenticateAddress(ownerAddress));
    if (addressErr) return negotiatorAuthenticator.errorHandler("Could not validate ownerAddress");
    return address;
}
negotiatorAuthenticator.authenticate = async (chosenTicket) => {
    const [ticket, ticketErr] = await asyncHelper(Authenticator.authenticate(chosenTicket));
    if (ticketErr) return negotiatorAuthenticator.errorHandler("Could not authenticate ticket");
    return ticket;
}
negotiatorAuthenticator.errorHandler = (msg) => {
    return { error: msg }
}

// onload :
// async function() {
//     const tokens = (await Negotiator.getXXXTokenInstances());
//     tokens.forEach(putTokenOnUI);
//     // getting the attributes of tokens
//     isVIP = false;
//     tokens.forEach(
//         ticket => {
//             if (token.ticketClass == "VIP") isVIP = true;
//         }
//     }

//     // isVIP == the user has at least one token which is VIP.

//     document.getElementByID("vip-only-section").style.visibility = "visible";
// }()

// // when user clicked "VIP room" button

// async function vip-room-clicked() {

//     /// ... let user choose which ticket to use for authentication
//     vip-tickets = tokens.filter( ticket => (ticket.ticketClass== "VIP") );

//     // populate the vip-ticket selector window
//     populate-vip-ticket(vip-tickets).then(chosenTicket => {
//         // first approach: disney mode
//         // this will lead to sign-message or email code
//         Authenticator.authenticate(chosenTicket).then(success, failure);
//     });

//     // non-disney mode
//     populate-vip-ticket(vip-tickets).then(chosenTicket => {
//         if (chosenTicket.ownerAddress == null ) {
//             Authenticator.findOwner() // lead to email code modal process, created by Authenticator.
//         }
//         if (chosenTicket.ownerAddress == currentUser.ownerAddress) {
//             // this will lead to sign-message, even if user typed the code in email.
//             Authenticator.authenticateAddress(currentUser.ownerAddress).then(success, failure);
//         }
//     });
// }

// // if the website generates a transaction to a smart contract which
// // requires a valid ticket.

// async function voteButtonCicked(ticket) {
//     // generate the vote transaction payloads (e.g. whom voted)
//     const payload = {vote: votedGui, weight: 3, expiry: 98109802843804}
//     payload.push(Authenticator.getProofOf(ticket))
//     // now it is {vote: votedGui, weight: 3, expiry: 98109802843804, ticketProof: proof}
//     // where the genreation of the proof might involve receiving email code in modal.
//     tx = {nounce: nounce, ......, payload: payload}
//     web3.ethereum.sendTransaction(tx); // then track the transaction status ...
// }

// // card at work: this will use wallet if possible, and this only works
// // if the vote action is provided (by the issuer)
// async function voteButtonClick() {
//     ticket.actions["vote"].render(document.querySelector(".voteCardContainer")).then(tx => watch(tx));
// }