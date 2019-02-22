# TBML Whitepaper

## Introduction

Blockchain technology has two primary functions that can change the way individuals and businesses behave; the first is the capacity to create a frictionless market and the second is the capacity to integrate the web. 

This paper will first address the vision of where we can be and follow up with the design and reasoning behind the architecture needed on top of blockchains. We will also present our technology known as TBML which provides this critical layer and makes the architecture possible. 

## Author's note

The remarkable crypto speculations that took place in 2017 - 2018 brought our attention to tokens. As we bought and sold them, we forgot that they were intended to be used. This is similar to the housing bubble of 2008 in which people forgot that houses were not merely speculative assets but rather a place for people to live. 

Despite this folly, it is not a bad thing to intially focus on tokens as they are the enabler of the two primary functions which we will elaborate on below. 

## The vision: frictionless markets

The 80s' "Back to the Future" featured a world of powerful machines filled with hovering boards and flying cars. It didn't happen. As Peter Thiel once famously lamented, "we were promised flying cars, instead we got a 140 characters". The technological advancement of our time is beyond the imagination of the 80s science fiction movies, albeit not through more powerful machinery, but more efficient use of information.

Ride-sharing revolutionised the way we organise our daily lives and Airbnb changed the way we travel. These are the new markets and they incur less cost to operate, are more accessible and have finer operational units.

Despite this web 2.0 revolution, the majority of markets still operate with high costs. The stock market for example, has so much overhead that it is only justifiable for multi-million dollar businesses which rely on the trust of rules and regulations to operate. 

## Can we create a more efficient market without the overhead?

Can we tokenise, for example, 1% of a property, so that the property market can react faster than the typical month-long property purchase-sales cycle? 

Can we tokenise electricity, so that power users can benefit from finer scheduling of the use of resources, and households can benefit from collecting surplus sun energy?

Can we tokenise AirBnB bookings, so that hosts can purchase a guaranteed cash flow from the market, while speculators profit from predicting the travel needs? 

Can we tokenise the risk of a shipment, so that small importers and exports, not significant enough to obtain letters of credit, can compete in international markets and perhaps eventually outcompete the traditional model like AirBNB outcompetes hotels?

Can we tokenise insurance that depends on cryptographic proofs, so that the insurer bares less cost of fraudulent documents? Can we decentralise the insurers altogether?

Blockchain technology can provide the foundational layer to achieve these. A lot of work needs to be done to ensure scalability, privacy and quality methods to define how tokens should be used and traded.

This paper does not intend to provide a full solution, instead, it focuses on the last part, on quality methods to define how tokens should be used and traded.

Tokens have different properties. Do tokens expire? AirBNB booking tokens certainly do, but 1% ownership of a property tokens probably don't. Should the token owner receive a notification on a specific event? Power tokens certainly need that, for the change in the power supply is dynamic. Is a token stream-able?

How does it look on the user's mobile, and how is it called in a users language?

If a buyer wants to purchase a tokenised country estate from a seller, how do they establish a trusted method of communication?

If a token entitles the user to do specific actions online, how can the user login to the web services with that token?

We have done very little on making the tokens interoperable with different methods of trading, listing and rating; there is nearly zero effort devoted to making tokens represent *goods and services* - a basic need for an efficient market.

During the speculative bubble of 2017, a power token ICO, does not need to provide any explanation of how the tokens can be used. All speculators need to know is that they represent a "stake in the future tokenised electricity". As long as the token can fill investors with imagination, it's good enough for an ICO. There is, no more functionality needed other than an ERC20 interface. Such a speculative token doesn't depend on attestations - the proof of actual power production - nor does it need properties like where the energy is provided or for how long it is available. There is no need to do actual work besides the marketing and creation of an ERC20 token. 

With the madness over, it is time to present a framework for describing such token behaviours. 

Such a framework must fit tokens into different environments for them to function as use-cases, they must:
- Let the user interact with different IT systems and APIs
- Make them render-able and associated with the actions they can perform in the user's wallet
- Making them fit into listing or auction based general-purpose markets; building one marketplace for one token type would be too inefficient.
- Allow new protocols to be developed on top of them (streaming, communication, staking, collateralization, etc.)

## Integrating the web.

Tim Berners-Lee and the innovators of the world wide web modelled the web primarily on a public library model and computer-human interaction model.

In the library model, information is freely available, indexed and cross-referenced by a URI. Its incarnation, the URL, is where the data is, and there is no restriction on where you can go.

In the computer-human interaction model, two players are having a conversation - the human asks and the machine answers. A computer has limited knowledge, but it can help the user to reach the right computer.

Therefore the web was built as a giant library where each book is a computer with whom one can have a conversation. It's probably where Facebook got its namesake inspiration - a website that is a book.

This design has caused a lot of modern inconveniences. A user would receive an email about the shoes she ordered, she then takes the delivery tracking number, opens the Australia Post website - another book in the giant library of the web - and types in the tracking number to find the current status. On a different day, the same user might pause as she books two tickets for an opera, switch to her frequent flyer app, copy that number over and paste it into the order to collect the points. She might struggle a bit installing that frequent flyer app to start with.

Why are we doing so much copy and pasting when machines are exceptionally good at doing those? It's because the web is like a giant library by design, and we are like readers keeping notes of the index numbers under our sleeves. It's not designed like a personal assistant.

It's easy to see the cause of the inconvenience, the web is poorly integrated. When a user checks out on a website, she isn't sure if she has enough balance on her card, because the bank is not integrated with the shopping system. When a patient orders a service, she can't see how much the insurance can cover until the bill is settled, nor can she see whether she has reached the annual cap, because the clinic is not integrated with the health insurance company.

The answer to an integrated web requires a few building blocks that weren't in the blueprint: authentication, ownership, transfer of value and trading.

The web doesn't have a built-in authentication mechanism†. The add-on "Sign in with Facebook" merely tried to provide authentication through a trusted 3rd party, which, despite privacy and availability concerns, is only good for account authentication and not for business logic.

†  Despite the excellent efforts on client/server certificates in TLS, these authentication methods are not for processes, but sites only. It's a delegation model. Imagine a buyer not checking if a title deed is real, but only checks if the seller's name matches the one on the deed. That would be the delegation model used in TLS. In fact, TLS can't guarantee anything on the website is real, only that the website is real.

For example, the simple business logic: "the owner of the property is able to check its easement information", doesn't require account authentication on its own and it would be a bad idea to add account authentication on top of it. This is because if the property is sold, the new property owner would now need to create a new account at the easement service website and secure it with the proof of ownership to the property. This process is onerous and inflexible, as it doesn't allow the owner to authorise the access to a 3rd party like a landscape planner or a pest inspector. Such authentication needs are easily found in healthcare, retail and almost every web-based business. Today, we repeatedly add more and more accounts to address such integration needs and when our tool is a hammer every problem looks like a nail.

The web also doesn't have an ownership or transfer of value mechanism. If Alice is interested in a "Magic: The Gathering" card, and it popped up in the market, Alice will need to create an account on a website like mtgox.com, shorthand for "Magic The Gathering: Gox", to trade it. She might also need to sort out a payment method with a Paypal account. Properly integration is often lacking for complexity or security reasons, and the user has to do it manually. For every integration, the user needs to own two accounts and when she wants to use the card in an online game, she will need a third account to login to the game. She can't click on a link in an email and immediately use the card in a game.

It's easy to see that these building blocks are necessary for an integrated web and that blockchains can serve this need, but what's the path to get there? We assert that the way to get there is a data processing language that defines tokens and their behaviour. In such a design, the token is the integration point and the language is the interface for the integrations. Tokens seamlessly go accross systems, examplified by a property token being used for renting, insurance, pest inspection, mortgages and many other systems. It must define its own behaviour pattern which can be used to interact with users to show the status and allow functions to be natively integrated. In other words, a token must have it's own UI and integration logic. 

[a picture of an example of property token that has two statues side by side. The left side has an action button (among others) that says Power Connection. The right side has the same token, but with a "Leased" label on it, and the "Power Connection" action button is invalidated because now it is with the lessor]


## Introducing TBML

TBML stands for Token Behaviour Markup Language and is our framework for defining such a context for dapps to integrate on their own and with other dapps. 

It is similar to XML and allows HTML and JavaScript to be injected into the file so that it can define it's functionality, UI and relationships to tokens and other dapps on the blockchain.

# address "Frictionless Market" needs

We assert that a language for dictating the behaviour of a token is needed. Its design requirement follows its intended goal: to facilitate frictionless market and to integrate the web.

A market is a place where delivery vs payment happens. On the deliverable side, there are all sorts of things money can buy: assets, goods and services. On the payment side, there are Ether, DAI, Sovereign etc. The fact that any blockchain asset can be transacted any time, as long as it follows the rules, without middlemen being intermediary, gives us maximum market efficiency - the frictionless market. However, both the deliverables and the payment side requires a framework to "plug-in" - the TBML token behaviour language we are proposing.

It's easier to demonstrate the design requirements with an example. Let's imagine a market for 1% property. A property owner can issue many pieces of a token, each represents 1% ownership of the property. He can sell these tokens to obtain cash.

A buyer needs to know quite a bit of information. It's easy to understand that such a token would fetch 1% of the sales revenue if the underlying property is sold, but a lot more details are needed:

- Where is the property and how its current status is?
- Can a 1% property token owner vote?  For example, on the purchase decision to insurance against bush fire?
- Is the 1% automatically converted into currency at the time of property sales, or can the token holder elect to keep it?
- Is the token properly underwritten to prevent double-collateralization?
- If the property was collateralized for a mortgage, what is the condition for a liquidation event where the tokenised share of the property is of a smaller percentage of the entire asset than the owner can rightfully issue token with? [damn, let's fix this sentence]
- Is providing identity attestation a condition of purchase?

A lot of the details are in the smart contract that holds the asset, for example, the total number of tokens issued by the issuer. Much is not, for example, how to fetch previous sales prices of the land from an online title deed database.

Typically, nowadays those token related information are locally coded in a Dapp in the form of a website. We envision it to be best abstracted out and placed in a token behaviour language TBML. You can imagine it works like a data processing language that for a given token:

- It fetches token related information from its holding smart contract and 3rd party sources.
- It has a rendering section where the token is rendered in visual or audio fashion.
- It has a transaction section where the purpose and condition for trade and transactions are described (a superset of ABI).

Any party is able to render and apply functions to the token using TBML, including entities like generic marketplaces, user-agents and 3rd party apps.

In general, providing a layered structure, using and reusing it, is better than having a monolithic design where a Dapp tied to an asset class and have all knowledge of the asset locally. The reasons are interoperability, scalability and security. Specifically, with the 1% property token as an example, the interoperability, scalability and security concerns are demonstrated below.

## Interoperability:

Suppose a property guru Peter wish to create a website called "Peter's Pride Asset", where he selects the best property available on the market. He can create a listing of those properties with rich information of the current price, location, years of the building and even photos, which the users can purchase with a click. There is no reason that he needs permission to do so because the data of those tokens are on the blockchain and the transaction of those tokens requires no middlemen. However, he would necessarily need to obtain the knowledge local to how to render the token on his website, like how to get the expiration of a token from its holding smart contract. If the underlying smart contract has gone through changes, like adding an attribute (e.g. council rate), his website would need to upgrade. Similarly, the transaction rule might be updated to require the buyer to submit an identity attestation as part of a purchase. Without a speedy upgrade, his users would submit transactions not conforming and gets rejected later in the blockchain. In the end, he would resort to passing the rendering and trading of the token to the Dapp tied to this token, returning to a centralised status and limit the innovation and competition in this space.

In a similar fashion, suppose an investors' forum where the members are allowed to login using their 1% property token, the rendering of the token, under each post, would need to be sourced from the Dapp tied to the token, since it's too much work for a forum to render the token and keep the code updated. Such sourcing would require permission and might be tied to the availability of that Dapp.

## Scalability

Horizontally, the same type of asset might have tokens across multiple networks like Plasma Chains. A buyer is likely to be interested only in assets in Australia, and therefore only connected to the Australian 1% Property network. It can be difficult to have an all-knowing node to provided rendered token information for all existing tokens, especially if a network is designed with privacy in mind. Therefore, to scale, the knowledge about token (TBML) must be detached from the access to the token.

Vertically, if we desire a token whose makeup is 1% property token from a sample of 100 global cities, for mid-big size investors to distribute the risk, a computer system that can manipulate such token must be built with the knowledge about member tokens. It again cannot depend on the availability, security and openness of the original Dapp tied to that asset. TBML would work in the middle for the making of such tokens.

## Security

It is impractical to improvise a schema where every transaction the user might sign is rendered in a user-readable format. It's easy to start with such an effort with a transaction data translation tool, translating enigmatic transaction payload to a user readable data, but ultimately system integration needs and UX needs would surpass what a translation engine can do.

Take the 1% property token as an example, a confirmation might look like this: You are going to purchase 1% of property #802820 with 45 Ethers, are you sure?

The user would be unsure if the glass ceiling designer 2-bedroom house he is watching is #802820.

A translation tool cannot go further because properly rendering the property token requires more than word processing. This limit is easily hit even without introducing complex integration scenarios where more than one tokens are involved in a transaction (e.g. purchasing a used car and get a car token plus a warranty token).

Eventually, a transaction is generated with code, and the user would have to delegate the trust to the code. In a user's words, it's like this: I am accessing the website tied to this token, so I will trust that this transaction I am signing is generated for the intention I have while using the website.

TBML is designed to separate token rendering code and transaction generating code and package them into its own container, signed by a party that the user is likely to trust. There are a few trust levels, which we will detail in the later chapters.

A user who is purchasing a 1% property token from Peter's Pride Property recommendation website can be provided with rendering and transaction packaged and signed by the same group of people who created the holding contract of such tokens, therefore the user can purchase assets from any website with a similar level of trust, or purchase it from a WeChat or Facebook private message and know it is the real token being rendered and  transacted.

## Design requirement for frictionless market

TBML language has to provide:

- Where to find the asset (which chain, what smart contract holds the asset)
- Vocabulary for token assets
- Methods to render and translate attributes in local languages
- Methods to obtain 3rd party information and a list of what 3rd parties are trustworthy.
- A superset of ABI information that informs users the purpose of the transaction.

And it should be usable by:

- The Dapp created by the token issuer;
- Any 3rd party Dapp that might use the token;
- A generic market not owned by the token issuer;
- Various user-agents, in rendering and using the assets in the wallet section of mobile and desktop wallets.

We will proceed on addressing the need for "Integrating the Web" and come to a full picture of the design requirements of TBML in the following chapters.

# address "Integrate the web" needs

[todo]

 

------------ [ the following is from the old 1st chapter ] -------------

The world wide web was made for information sharing.

The web lacks native support for the building blocks of today's internet economy. These are authentication, transfer of value or trusted relationship expression (facebook friends for example). Tim Berners-Lee envisioned the web as a document platform. HTML, today mostly used to represent the user interface, was originally a document format suitable for free information. The last decade saw the rise of modern programmable web browser technologies, such as JavaScript, that aimed to allow various middlemen to provide what was missing in the blueprint of the web: Facebook to be entrusted with personal trust; Paypal to be entrusted with transfer of value and Amazon to be entrusted with e-commerce trades.


Bitcoin, for the first time, made it possible to transfer value without an intermediary. With these principles, Ethereum and various other blockchains have enabled an expressive, trusted world computer whose computational matrix is made of value, trust relationships and business rules. Reliably  providing these outputs in this current era can only be procured via a myriad of instituions, overly trusted corporations, leaky privacy potections and regulations. 

(duplicate: These fundamental technologies allowed us to build a new web without trusted middlemen - in some scenarios, even completely without middlemen, as proven in the FIFA ticket trading experiment we conducted mid-2018.)

To participate, we need a global interface, a new world-wide-web, to the computer, but the web is not ready for the change.

Vitalik Buterin envisioned web3, the new web with blockchain and without a lot of middlemen. It provided, for the first time, the capacity for a web application to access Ethereum nodes.

However, Ethereum nodes are not the objects we can use to access the web. It's a tool that doesn't fit the ship of hands.

The old world-wide-web connects people through clicks, forms and search queries. The new world-wide-web, web3, carries trust around by the use of tokens and cryptographic attestations. There lacks the technology to allow tokens to interact with web applications. Today's most popular concept, the Dapp browser, is largely just a connector to blockchain nodes. It is oblivious of what tokens the user has, in what stages the tokens are being used (e.g. collateralized), or even how to display that token in the user's language. It cannot facilitate the way of interaction demanded by web3.

In order to overcome the missing gap, Dapps work very hard to control what belongs to the users directly. A Dapp that sells pizza, for example, will not only display the pizza and manage the shopping cart but also does a lot for the payment, it:

- loops through a list of known tokens that can be used to purchase the pizza;
- requests the user's public key, checks the user's balance in each of those tokens and unnecessarily learns the users wealth;
- renders a selection list for the user to choose a token;
- assembles the transaction using the user's choice of token.

This approach, if compared to the good old world-wide-web, is like having the web application access the user's CPU and keyboard, reading input directly from the user's keystrokes. If the user upgrades his keyboard to a USB model, the web application has to update their code to understand the new type of keystrokes.

Similarly, in the current web3 model, if there is another token that becomes popular, or even if the existing one changed their contract a bit to work around a security issue, the Pizza selling website would need to update their code.

This has the result of either making dapps expensive and hard to secure (current status) or gives rise to cloud-based web-logic code centres who can update their code frequently and securely for the much smaller pizza shops, re-introducing a third party that has to be trusted.

Furthermore, the current status does not scale. It requires the web application to have the full view of the underlying blockchain, which can't always be provided for security, privacy or bandwidth reasons. This is a more prominent problem when scalability technologies like Plasma enable high-throughput blockchains and blockchains whose blocks are not public. It also doesn't allow the user to provide attestations(cryptographically signed directives) for use cases such as ticketing, token proofs (He is my friend for example), big proofs like Merkle-trees or serious proofs like identity (KYC). This is because such attestations behave like tokens but do not live on the blockchain for privacy, cost or bandwidth reasons. 

# Magic Links

Magic links are simply a signed message for an atomic swap. It facilitates one major function of traditional financial institutions, a function called  "Delivery versus Payment", whereby one party, the buyer, pays in a currency and the other delivers an asset to be purchased. In today's financial world, delivery of physical goods is not a concern of the financial institutions. Once the transaction is done on paper or on a computer, it is considered done. This assumption is built on the trust towards financial institutions.

(Consider deletion: If, for example, the transaction consists of a loan in the form of currency and a car the loan is used to purchase, then the actual delivery of the car is out of concern, and both the buyer and seller are expected to follow what the computer tells them to do.)

# Assets

In TBML terminology, an asset is something that can be owned and has value. This is a broad definition and doesn't require, like the financial assets, that an asset produces a return, or is anticipated to.

Attestations are like Tokens except that they are not transferable, in the case that a smart contract allows them to be transferred, the original attestation is render invalid after the transfer.  This makes it possible for things like friendship to be defined in a way similar to the token, and therefore, we may as well call such attestations "tokens". A token of friendship would be a signed message from someone, recognising someone else as a friend, and it would be an asset in TBML terminology. Apparently a token of friendship from Michael Jackson can be of high value, especially since he cannot produce any more of these tokens, but even a humble token like "Friend of Weiwu" has some value. It, for example, allows a friend of Weiwu to sign a delivery recipt for him, or allows such a friend to get a mate-rate for signing up in the same dojo Weiwu practises in. There is even a neat trick, which, by using secret sharing protocols, having Weiwu's friendship token allows one to learn common friends shared with Weiwu. Notice that this definition does not require the asset to be a blockchain token, nor that it even exists on the blockchain. More on that in the latter chapter "attestation".

Assets and attestations (tokens in general) can have financial value and utility value.

Examples of Assets with financial value:

Rental....

Airbnb ...

# Actions

Actions are things that can be done to an asset.

Regarding the financial properties of an asset, typical actions are transfer, sell, buy, collateralise, combine (e.g. in the case of cross-collateralization), insure, auction and testify (obtain a signature of someone in order to satisfy certain trading requirements).

The other actions depend much on the utility properties of an asset, however, this varies from one type of asset to another. AirBNB token, for example, would allow a user to open the smart-lock of their AirBNB room at the time it is reserved for. That's probably all the utility you can get from the AirBNB token, but game assets, for example, can be equipped, unequipped, transmuted, transmogrified, enchanted, disenchanted, cursed, purged, socketed, unsocketed, broken-down, recycled, consecrated... Imagination is the limit.

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
    | Pre-authorisations                               |
    | +--------------------------------------------+  |
    | |                                            |  |
    | | - The Guardian: biweekly,  $10, no expiry. |  |
    | | - Pablo & Rusty's: monthly, $28, till 2019 |  |
    | |                                            |  |
    | |           Displaying 2 of 5 authorisations |  |
    | +--------------------------------------------+  |
    |                                                 |
    +-------------------------------------------------+

		  ◀          ◉         ◼


[explains the attestations associated with this token.]

The case with non-fungible tokens are more complicated. Let's continue with the AirBNB example. If Alice owns a token that represents the right to use a room during certain time window, or "a booking" in user's terms, then the actions she could perform are:

Check-in - either produce a QR code to verify the booking to the landlord, or use an NFC-enabled phone to open a smart-lock.


      Singapore Telecom  13:45 31 Jan 2018          4G
     +-----------------------------------------------+

     +-----------------------------------------------+
     |  AirBNB Booking                               |
     |               BELONGS EVERYWHERE               |
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




     Singapore Telecom  13:45 31 Jan 2018          4G
    +-----------------------------------------------+

    +-----------------------------------------------+
    |                                               |
    | AirBnB Booking                                |
    |                                               |
    |   92 ELIAS ROAD, SINGAPORE, 519951            |
    |                                               |
    | Check-in: 31 Jan 2018 1pm + 6pm                |
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
    | | You: We are travellers form Australia,    | |
    | |      Judging from the pictures you have   | |
    | |      a Veranda?                           | |
    | |                                           | |
    | | VeryHappyBunny: A patio actually, you     | |
    | |              can use it anytime.          | |
    | |                                           | |
    | | (You confirmed a booking)                 | |
    | |                                           | |
    | | You: Good, we will get there after lunch. | |
    | |                                           | |
    | +-------------------------------------------+ |
    |                                               |
    |                                               |
    +-----------------------------------------------+

	   ◀          ◉         ◼


[The concept of delivery vs payment and how it is useful in both investments and consumption.]

(This section is in the early draft stage, never mind the clutter)

In the traditional financial world, transactions usually involve a currency in exchange of something deliverable.



In the case that the deliverable is an asset, like a property or security, the transaction is considered done when the paper process or computer process is done. It's unlikely that the property owner will refuse to hand over the keys to the new owner or the company will refuse to share the dividend to an individual subscriber.



In the case of purchasing common goods and services, the deliverable will usually be physical. If I buy a printer online, a printer gets delivered home; if I order a massage service, someone shows up at the door. Delivery is an essential part of such transactions, and most payment processors like Paypal would not consider the transaction final unless delivery happened.



[Picture illustration of payment vs goods and services, and payment vs asset]



In today's economy, the difference between the two kinds is getting smaller. Goods and services can be investment candidates. Typically, old wine is usually purchased as goods but used as an investment asset. Even services, like hotel reservations, can be bought wholesale and speculated upon. On the other hand, properties like buildings can count towards goods and services in some cases.



We observe that when a purchase happens, the deliverable is often made up of two components: rights and consumables.



In the case of purchasing a share of a company, the right to enjoy dividend is the entire delivery. There is no consumable component of that purchase. In the case of purchasing a BigMac, the consumable is the entire delivery. There is no rights component to that purchase. These are purchases purely for rights and consumables, respectively.



But most transactions fall between those two kinds.



Online purchases, for example, are usually either an exchange between currency with a promise to deliver physical goods or the right to pick it up from the local post office, which is a right until redeemed. A ticket is a type of consumable that is always sold as a right because the consumable service is not available at the time of purchase. In these examples, the purchaser obtains a right as the result of the transaction which can later be redeemed for consumables. 



There are other rights than the right to redeem. Most purchases involve a receipt which represents the right to return the goods under specific conditions. Many purchases also involve a warranty, insurance or reward points; which represent, respectively, the services to repair the goods, the right to sell broken products back or the entitlement of a discount in future purchases.



Even the traditional purchase of an investment asset might have a consumable component.  Sometimes, the shareholders might be okay with goods and services produced by the company as a dividend, which may surpass the dividend in value to them. But that structure, otherwise known as co-op, is usually not practical thanks to the lack of a secondary market for those goods and services.



Table: examples of purchases and input / output of those purchases



Typical tokens in e-commerce setting:



Delivery Token

- Get a notification when the product is delivered.

- Obtain goods from the collection point.

- Authorise someone else to obtain the goods.



Invoice Token

- Proof to the tax authority (for a tax deduction), if paid.

- Request payment from the employer



Receipt Token

- Return or change a faulty product



Insurance token

- Sell the product back



Product ownership token

- Access warranties and other services.

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


