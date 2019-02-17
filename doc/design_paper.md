
# Introduction

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


