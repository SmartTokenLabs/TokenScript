
# Whitepaper

There are two primary functions of blockchains that can change the way human interacts and business conducts. Both were neglected amidst the unfortunate speculative games in the early days of Blockchain.

As we will soon elaborate, the first is the capacity to create frictionless markets. The second is the capacity to integrate the web.

This paper is going to start with the vision, then, reason the architect needed on top of blockchains, then focus on a critical layer of technology that enables this architect to be possible, which we name TBML.

The remarkable blockchain speculations took place in 2017 - 2018 brought our attention to tokens. As we buy and sell tokens, we forgot that it was intended to be used. It was like when canned sardines became a speculative asset, people brush off the idea that it was made to eat.

Despite the unfortunate speculative bubble, it's not wrong to focus on tokens, as it is the enabler of the two primary functions we will elaborate:

## The vision: frictionless market

The 80s' "Back to the Future" featured a world of powerful machines: hovering boards, flying cars. It didn't happen. The technology advancement in our time is beyond the imagination of the 80s science fiction movies, albeit not through more powerful machinery, but more efficient use of information. Ride-sharing revolutionised the way we organise our daily lives, and Airbnb changed the way we travel. These are the new markets. They have less cost to operate, more accessible and have finer operational units.

However, the majority of the markets still operates with high costs. The stock market, for example, has so much overhead that is only justifiable for multi-million businesses thanks to its reliance on rules and regulations to function.

Can we create more efficient markets without the overhead?

Can we tokenise, for example, 1% of a property, so that the property market can react faster than the typical month-long property purchase-sales cycle? Can we tokenise electricity, so that power users can benefit from finer scheduling of the use of resources, and households can benefit from collecting surplus sun energy?

Can we tokenise AirBnB booking, so that the hosts can purchase a guaranteed cash flow from the market, while speculators profit from predicting the travel needs? Can we tokenise the risk of shipment, so that small importers and exports, not significant enough to obtain letters of credit, compete in international markets, and perhaps eventually outcompete traditional model like AirBNB outcompete hotels?

Can we tokenise insurance that depends on cryptographic proofs, so that the insurer bare less cost of fraudulent documents? Can we decentralise the insurers altogether?

Blockchain can provide the foundation layer to achieve those.  Much work still needs to be done on scalability, privacy, and last, the focus of this paper, quality methods to define how tokens should be used and traded.

Does a token expire? AirBNB booking tokens certainly do, but 1% property token probably not. Should the token owner receive a notification on specific events? Power token certainly needs that, for the change in the power supply is dynamic. Is a token streamable?

How does it look on the user's mobile, and how is it called in users language?

If a buyer wants to purchase a tokenised country estate from a seller, how do they establish a trusted method of communication?

If a token entitles the user to do specific actions online, how can the user login to the web services with that token?

We have done very little on making the tokens compatible with different methods of trades, listing and rating. There was nearly zero effort to make tokens represents *goods and services* - a basic need for an efficient market.

During the speculative bubble in 2017, a power token ICO, as an example, does not need to provide any explanation of how the tokens can be used. All speculators need to know is that they represent a "stake in the future tokenised electricity". As long as the token can fill investors with imagination, it's good enough for an ICO. There is, therefore, no more functionalities needed other than an ERC20 interface. For such a speculative power token, it depends on no attestations like the proof of actual power production, no properties as where the energy is provided, for how long it is available. There is just no need to do any work than making it ERC20 compatible.

With the end of the speculative frenzy, now is a good time to present a framework for describing token behaviours.

Such a framework must fit tokens into different environments for them to function in use-cases.

 - letting them interact with different IT systems and APIs
- making them renderable and associate tokens with the actions they can perform in user's wallet
- Making them fit into listing or auction based general-purpose markets. Building one marketplace for one token type would be too inefficient.
- allow new protocols to be developed on top of them (streaming, communication, staking, collateralization  etc.)

The following chapters of this paper will elaborate on this technical framework.

## Integrate the web.


Tim Berners-Lee and the innovators of the world wide web modelled it mainly after a public library model and computer-human interaction model.

First, the library model. In this model, information is freely available and indexed and cross-referenced by a URI. Its incarnation, the URL, is where the data is, and there is no restriction on where you can go.

Second, the computer-human interaction model. In this model, two players are having a conversation - human asks, machine answers. A computer has limited knowledge, but it can help the user to reach the right computer.

Therefore the web was built as a giant library where each book is a computer with whom one can have a conversation. It's probably from where Facebook got its namesake inspiration - a website is a book.

It's this design that caused a lot of modern inconveniences.

A user would receive an email about the shoes she ordered. She takes the delivery tracking number, opens the Australia Post website (another book), type in the tracking number to find the current status.

Another user pauses as he books two tickets for an opera, rummages through his wallet to find his frequent flyer number, types it into the order to collect the points.

Why are we doing so much copy and pasting when machines are exceptionally good at doing those? Because the web is like a giant library by design, and we are like readers keeping notes of the index numbers under our sleeves. It's not, for example, designed like a personal assistant.

It's easy to see the cause of the inconvenience: the web is poorly integrated. When a user checks out on a website, she isn't sure if she has enough balance on her card, because the bank is not integrated with the shopping system. When a patient orders a service, she can't see how much the insurance can cover it until the bill is settled, nor whether she has reached the annual cap, because the clinic is not integrated with the health insurance company.

The answer to an integrated web requires a few building blocks that weren't in the blueprint: authentication, ownership, transfer of value and trading.

The web doesn't have a built-in authentication mechanism†. The add-on like "Sign in with Facebook" merely tried to provide authentication through a trusted 3rd party, which, despite privacy and availability concerns, is only good for account authentication, not for business logic.

†  Despite the excellent efforts on client/server certificates in TLS, these authentication methods are not for processes, but sites only. It's a delegation model. Imagine a buyer not checking if a title deed is real, but only checks if the seller's name matches the one on the deed. That would be the delegation model used in TLS. In fact, TLS can't guarantee anything on the website is real, only that the website is real.

For an example simple business logic: "the owner of the property is able to check its easement information". The logic itself doesn't require account authentication on its own, and it would be a bad idea to add account authentication on top of it since if the property is sold, the new property owner would now need to create a new account at the easement service website, secure it, and proof the ownership to the property. Besides being onerous, this process is also inflexible: it doesn't allow the owner to authorise the access to a 3rd party like a landscape planner or a pest inspector. More such examples are easily found in healthcare, retail and almost every business on the web. Today, we repeatedly add more and more accounts to address such integration needs. When our tool is a hammer every problem looks like a nail.

The web also doesn't have an ownership or transfer of valve mechanism. If Alice is interested in a "Magic: The Gathering" card, and it popped up in the market, Alice will need to create an account on a website like mtgox.com, shorthand for "Magic The Gathering: Gox", to trade it. She might also need to sort out a payment method with a Paypal account. Nothing is properly integrated, the user has to do it. For every integration, the user needs to own two accounts. When she wants to use the card in an online game, a third account she will need. She can't, for example, click a link in an email and, like magic, the money goes to the seller and the card is hers, in an atomic transaction, and ready to be used in her games.

It's easy to see that these building blocks are needed for an integrated web, and blockchain can serve the need. But what's the path from the integration need to the base technology?

We know computers are good at computation, and science needs computation. The path, as it turned out, is data processing programming language. Similarly, to integrate the web using a trust layer like blockchain, the path is Token and a token behaviour language.

In such a design, Token is the integration point, and token behaviour language is the interface for integration. Knowing token can go across systems, like Property Ownership token being used in land registration, insurance, pest inspect, mortgage and lots of systems, it must have its own behaviour pattern that can interact with users, to show the status and allow action buttons for functions to be integrated. In other words, a token must have its own UI logic as well as integration logic.

[a picture of an example of property token in two statues side by side. The left side has an action button (among others) that says Power Connection. The right side has the same token, but with a "Leased" label on it, and the "Power Connection" action button is invalidated because now it is with the lessor]

------------ [ following are from the old 1st chatper ] -------------

The world wide web (The web) was made for information sharing.

The web lacks native support for the building blocks of today's Internet economy: authentication, transfer of value or trading, or express trusted relationship like Facebook friend introduction. Tim Berners-Lee envisioned the web a document platform. HTML, today mostly used to represent user interface, was originally a document format suitable for free information. The last decade saw the rise of modern programmable web browser technologies, aimed to allow various middlemen to provide what was missing in the blueprint of the web: Facebook to be entrusted with personal trust; Paypal to be entrusted to transfer value and Amazon to be entrusted for e-commerce trades.

Bitcoin, for the first time, made it possible to transfer of value without an intermediary. Built on its principles, Ethereum and proliferation of blockchain technologies enabled an expressive, trusted world computer, whose computational matrix is made of value, trust relationship and business rules, reliably providing outputs which, at this era, can only be procured through a myriad of institutions, overly-trusted corporations, leaky privacy protections and regulators.

(duplicate: These fundamental technologies allowed us to build a new web without trusted middlemen - in some scenarios, even completely without middlemen, as proven in the FIFA ticket trading experiment we conducted mid-2018.)

To participate, we need a global interface, a new world-wide-web, to the computer.

But the web was not ready for the change.

Vitalik envisions web3, the new web with blockchain and without a lot of middlemen. It provided, for the first time, the capacity for a web application to access Ethereum nodes.

However, Ethereum nodes are not the objects we can use to access the web. It's a tool that doesn't fit the ship of hands.

The old world-wide-web connects people through clicks, forms and search queries. The new world-wide-web, web3, carries trust around by the use of tokens and (cryptographic) attestations. But there lack the technology to allow tokens to interact with web applications. Today's popular concept, Dapp browser, is largely just a connector to blockchain nodes. It is oblivious of what tokens the user has, in what stages are the tokens being used (e.g. collateralised), or even how to display that toke in user's language. It cannot facilitate the way of interaction demanded by web3. 

In order to overcome the missing gap, Dapps work very hard to control what belongs to the users directly. A Dapp that sells pizza, for example, not only display the pizza and manage the shopping cart but also does a lot for the payment:

- loops through a list of known tokens that can be used to purchase the pizza;
- requests the user's public key, check the user's balance in each of those tokens, learning the user's wealth unnecessarily on the way;
- render a selection list for the user to choose a token;
- assemble the transaction using the user's choice of the token.

This approach, if compared to the good old world-wide-web, is like having the web applications to access the user's CPU and keyboard, reading input directly from the user's keystrokes. If the user upgrades his keyboard to a USB model, the web application has to update their code to understand a new type of keystrokes.

Similarly, in the current web3 model, if there is another token becomes popular, or even if the existing one changed their contract a bit to work around a security issue, the Pizza selling website would need to update their code.

This has the result of either making dapps expensive and hard to secure (current status) or give rise to cloud-based web-logic code centre who can update their code frequently and securely for the much smaller pizza shops, re-introducing a third party that has to be trusted.

Furthermore, the current status does not scale. It requires the web application having the full view of the underlying blockchain, which can't always be provided for security, privacy or bandwidth reasons. This is more prominent a problem when scalability technologies like Plasma enabling high-throughput blockchains and blockchains whose blocks are not public. It also didn't allow the user to use attestations (cryptographically signed directives), which serve purposes from event tickets, redeemable tokens to proofs - small proofs like friendship status proof (for a social network), big proofs like entire Merkle-trees, serious proofs like identity proof (for KYC). This is because despite such attestations behave like tokens in many ways, they do not live on the blockchain for privacy or bandwidth reasons.

# Magic Links

Magic links is simply a signed message for automic swap. It facilitates one major function of traditional financial institutions, a function called  "Delivery versus Payment", where one party, the buyer, pays in a currency and the other delivers an asset to be purchased. In today's financial world, delivery of physical goods is not a concern of the financial instutions. Once the transaction is done on paper or in computer, it is considered done. This assumption is built on the trust towards the financial instituions.

(Consider deletion: If, for example, the transaction consists of a loan in the form of currency and a car the loan is used to purchase, then the actual delivery of the car is out of concern, and both the buyer and the car seller are expected to follow what the computer tells them to do.)

# Assets

In TBML terminology, an asset is something that can be owned and has value. This is a broad definition of asset. It doesn't require, like the finanical assets, that an asset produces a return, or is anticipated to.


Attestations are like Tokens except that they are not transferrable, or, if a smart contract rules that they accept an attestation being transferred, it is rendered invalid after the transfer. This makes it possible for things like friendship to be defined in a way similiar to token, and we may as well call such attestations token. A token of friendship would be a signed message from someone, recognising some other as a friend, and it would be an asset in TBML terminology. Apparently a token of friendship from Michael Jackson can be of high value, especially since he cannot produce any more of these tokens, but even a humble token like "Friend of Weiwu" has some value. It, for example, allows a friend of Weiwu to sign a delivery recipt for him, or allows such a friend to get a mate-rate for signing up in the same dojo Weiwu practises in. There is even a neat trick, which, by using secret sharing protocols, having Weiwu's friendship token allows one to learn common friends shared with Weiwu. Notice that this definition does not require the asset to be a blockchain token, nor that it even exist on the blockchain. More on that in the latter chapter "attestation".

Assets and attestations (tokens in general) can have financial value and utility value.

Examples of Assets with financial value:

Rental....

Airbnb ...

# Actions

Actions are things that can be done to an asset.

Regarding the financial properties of an asset, typical actions are transfer, sell, buy, collateralise, combine (e.g. in the case of cross-collateralisation), insure, auction and testify (obtain a signature of someone in order to satisfy certain trading requirements).

The other actions depends much on the utility properties of an asset, however, varies from one type of asset to another. AirBNB token, for example, would allow a user to open the smart-lock of their AirBNB room at the time it is reserved for. That's probably all the utility you can get from AirBNB token, but game assets, for example, can be equiped, unequiped, transmuted, transmogrified, enchanted, disenchanted, cursed, purged, socketed, unsocketed, broken-down, recycled, consecrated... Imagination is the limit.

Let's start with fungible tokens, as they are somewhat simpler. In the following screen mock-up, the actions are: "Pay anyone", "Request Payment", "Convert to USD".

     Vodafone          13:45 31 Jan 2018          4G
    +-------------------------------------------------+

    +-------------------------------------------------+
    |                                                 |
    | SOVEREIGN - cryptocurrency of Marshall Islands  |
    |                                                 |
    | +---------------------------------------------+ |
    | |                                             | |
    | | Current Balance: $314.15 ($276.15 available)| |
    | |                                             | |
    | +---------------------------------------------+ |
    |                                                 |
    | +----------+ +---------------+ +--------------+ |
    | |Pay Anyone| |Request Payment| |Convert to USD| |
    | +----------+ +---------------+ +--------------+ |
    |                                                 |
    | Recent Transactions                             |
    | +---------------------------------------------+ |
    | |                                             | |
    | | 29 Jan BEKANT Desk - IKEA          -$499.99 | |
    | |        +-- Delivery Token - FedEx  [open]   | |
    | |        +-- Warranty 1 year - IKEA  [open]   | |
    | |                                             | |
    | | 28 Jan VISA Application             -$80.00 | |
    | |        +--- Receipt Token          [open]   | |
    | |                                             | |
    | | 26 Purchase SOVEREIGN from Ether   +$800.00 | |
    | |                                             | |
    | |             Displaying 3 of 94 Transactions | |
    | +---------------------------------------------+ |
    |                                                 |
    | Open Payment Channels                           |
    | +---------------------------------------------+ |
    | | GoCard:   Public Transit and parking fees   | |
    | |                                             | |
    | | Payment Channel                             | |
    | | Opened: 2019-04-05       Balance held: $50  | |
    | | Expiry: 2019-05-05    Current balance: $38  | |
    | |                                             | |
    | |                   [Inspect Payment Channel] | |
    | +---------------------------------------------+ |
    |                                                 |
    | Preauthorisations                               |
    | +--------------------------------------------+  |
    | |                                            |  |
    | | - The Guardian: biweekly,  $10, no expiry. |  |
    | | - Pablo & Rusty's: monhtly, $28, till 2019 |  |
    | |                                            |  |
    | |           Displaying 2 of 5 authorisations |  |
    | +--------------------------------------------+  |
    |                                                 |
    +-------------------------------------------------+

		  ◀          ◉         ◼


[explain the attestations associated with this token.]

The case with non-fungible tokens are more complicated. Let's continue with the AirBNB example. If Alice owns a token that represents the right to use a room during certain time window, or "a booking" in user's terms, then the actions she could perform are:

Check-in - either produces a QR code to verify the booking to the landlord, or use an NFC-enabled phone to open a smart-lock.


      Singapore Telcom  13:45 31 Jan 2018          4G
     +-----------------------------------------------+

     +-----------------------------------------------+
     |  AirBNB Booking                               |
     |               BELONG EVERYWHERE               |
     |                                               |
     | +-------------------------------------------+ |
     | |                                           | |
     | | + Create a new booking                    | |
     | |                                           | |
     | +-------------------------------------------+ |
     |                                               |
     | +-------------------------------------------+ |
     | | 31 Jan 2018 á 2 Feb 2018                  | |
     | |                                           | |
     | |    92 Elias Road, Singpaore, 519951       | |
     | |                                           | |
     | |    2 Bedroom unit, check in after 1pm     | |
     | +-------------------------------------------+ |
     |                                               |
     | +-------------------------------------------+ |
     | | 2 Feb 2018 á 6 Feb 2018                   | |
     | |                                           | |
     | |    9 Lemke Street, Muirhead, NT 0810      | |
     | |                                           | |
     | |    3 Bedroom house, self-check in         | |
     | +-------------------------------------------+ |
     |                                               |
     | +-------------------------------------------+ |
     | | 7 Feb 2018 á 13 Feb 2018                  | |
     | |                                           | |
     | |    Unit 1519, 28 Harbour Street, NSW 2000 | |
     | |                                           | |
     | |    2 Bedroom unit, checkin after 1pm.     | |
     | +-------------------------------------------+ |
     |                                               |
     +-----------------------------------------------+
               ◀          ◉         ◼




     Singapore Telcom  13:45 31 Jan 2018          4G
    +-----------------------------------------------+

    +-----------------------------------------------+
    |                                               |
    | AirBnB Booking                                |
    |                                               |
    |   92 ELIAS ROAD, SINGAPORE, 519951            |
    |                                               |
    | Checkin: 31 Jan 2018 1pm + 6pm                |
    | Checkout: 2 Feb 2018 10am                     |
    |                                               |
    |   Landlord: VeryHappyBunny                    |
    |                                               |
    | +--------+ +----+ +--------+ +----+ +-------+ |
    | |Transfer| |Lend| |Check in| |Sell| |Auction| |
    | +--------+ +----+ +--------+ +----+ +-------+ |
    |                                               |
    |                                               |
    |   Conversation history                        |
    |                                               |
    | +-------------------------------------------+ |
    | |                                           | |
    | | You: We are travellers form Australia     | |
    | |      Judging from the pictures you have   | |
    | |      a Veranda?                           | |
    | |                                           | |
    | | VeryHappyBunny: A patio actually, you     | |
    | |                 can use any time.         | |
    | |                                           | |
    | | (You confirmed booking)                   | |
    | |                                           | |
    | | You: Good, we will get there after lunch. | |
    | |                                           | |
    | +-------------------------------------------+ |
    |                                               |
    |                                               |
    +-----------------------------------------------+

	   ◀          ◉         ◼


Concept of delivery vs payment and how they are useful in both investment and consumption.

(This seciton is in early draft stage, never mind the clutter)

In the traditional financial world, transactions usually involve a currency in exchange of something deliverable.



In the case that the deliverable is an asset, like a property or security, the transaction is considered done when the paper process or computer process is done. It's unlikely that the property owner will refuse to hand over the keys to the new owner or the company will refuse to share the dividend to an individual subscriber.



In the case of purchasing common goods and services, the deliverable will usually be physical. If I buy a printer online, a printer gets delivered home; if I order a message service, someone shows up at the door. Delivery is an essential part of such transactions, and most payment processors like Paypal would not consider the transaction final unless delivery happened.



[Picture illustration of payment vs goods and services, and payment vs asset]



In today's economy, the difference between the two kinds is getting smaller. Goods and services can be investment candidates. Typically, old wine is usually purchased as goods but used as an investment asset. Even services, like hotel reservation, can be bought wholesales and speculated upon. On the other hand, properties like buildings can count towards as goods and services in some cases.



We observe that when purchase happens, the deliverable is often made up of two components: rights and consumables.



In the case of purchasing a share of a company, the right to enjoy dividend is the entire delivery. There is no consumable component of that purchase. In the case of purchasing BigMac, the consumable is the entire delivery. There is no rights component of that purchase. These are purchases purely for rights and consumables, respectively.



But most transactions fall between those two kinds.



Online purchase, for example, is usually an exchange between currency and a promise to deliver physical goods, or the right to pick it up from the local post office outlet, which is a right until it is redeemed. Ticket is a type of consumable that is always sold as right because the consumable services are not available yet at the time of purchase. In those examples, the purchaser obtains a right as the result of the transaction, which can be redeemed later for consumables.



There are other rights than the right to redeem. Most purchases involve receipt which represents the right to return the goods under specific conditions, and many purchases involve a warranty, an insurance or reward points, which represent, respectively, the services to repair the goods, the right to sell broken products back or the entitlement of discount in the future purchases.



Even the traditional purchase of investment asset might have a consumable component.  Sometimes, the shareholders might be okay with goods and services produced by the company as a dividend, which may surpass the dividend in value to them. But that structure, otherwise known as co-op, is usually not practical thanks to the lack of secondary market for those goods and services.



Table: examples of purchases and input / output of those purchases



Typical tokens in e-commerce setting:



Delivery Token

- Get a notification when the product is delivered.

- Obtain goods from the collection point.

- Authorise someone else to obtain the goods.



Invoice Token

- Proof to the tax authority (for tax deduction), if paid.

- Request payment from the employer



Receipt Token

- Return or change a faulty product



Insurance token

- Sell the product back



Product ownership token

- Access warrant and other services.

- Get notified of updates.


(The whole concept can be illustrated in a few examples, e.g. this car token)


       Telstra   13:45 31 Jan 2018          4G
    +-----------------------------------------+
    |                                         |
    | Holden Barina 2012 Ownership Token      |
    |                                         |
    | Make: Holden Year: 2013  Colour: Black  |
    | VIN: KL3TA48E9EB541191                  |
    |                                         |
    | +------+ +-------+ +------+ +--------+  |
    | | Open | | Start | | Lock | | Locate |  |
    | +------+ +-------+ +------+ +--------+  |
    |                                         |
    | +---------------+                       |
    | | Authorise use |                       |
    | +---------------+                       |
    |                                         |
    | +-------------+ +--------------------+  |
    | | Maintenance | | Roadside Assitance |  |
    | +-------------+ +--------------------+  |
    |                                         |
    | +---------------+                       |
    | | Collateralise |                       |
    | +---------------+                       |
    |                                         |
    | Registration:                           |
    |                                         |
    | +------------------------------------+  |
    | |                                    |  |         +-----------------------------+
    | | Issuer: Roads & Maritime Services  |  |         |                             |
    | | Rego: CJ41HL   Expiry: 2017-12-03  |  | ------> | Access rego attestation     |
    | |                                    |  |         |                             |
    | +------------------------------------+  |         +-----------------------------+
    |                                         |
    | Purchase:                               |
    |                                         |
    | +------------------------------------+  |
    | |                                    |  |
    | | Issuer: Manheim Auctions           |  |         +-----------------------------+
    | | Date: 2015+12+09   Price: $4724.83 |  |         |                             |
    | |                                    |  | ------> | Access Invoice Token        |
    | +------------------------------------+  |         |                             |
    |                                         |         +-----------------------------+
    | Insurance                               |
    |                                         |
    | +------------------------------------+  |         +-----------------------------+
    | |                                    |  |         |                             |
    | | Issuer: Virgin Car Insurance       |  |         | Access insurance token      |
    | | Start Date: 2017 12 30             |  |         | functions:                  |
    | |                                    |  | ------> |                             |
    | +------------------------------------+  |         | · Claim                     |
    |                                         |         | · Lump sum discount payment |
    | Services:                               |         | · Upgrade / downgrade       |
    |                                         |         | · Suspend policy            |
    | +------------------------------------+  |         |                             |
    | |                                    |  |         +-----------------------------+
    | | 2016+06+01 Holden Capped Service   |  |
    | |                                    |  |
    | | 2016+12+15 Holden Capped Service   |  |
    | |       +                            |  |
    | |       +--+ Tire replacement        |  |
    | |                                    |  |
    | | 2017+06+15 Holden Capped Service   |  |
    | |                                    |  |
    | +------------------------------------+  |
    |                                         |
    +-----------------------------------------+


                ◀          ◉         ◼


