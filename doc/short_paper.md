// This is a short version of a design paper, which takes the most important points and describes Tokenscript from an abstract, low-level point of view.

## Abstract
We recognise the blockchain technology's utility in providing a frictionless market and integrating the web. This is done through  a process we call *tokenisation*. 

However, the way tokens are used today does not fulfill the requirements for tokenization. Tokens are accessed, rendered and transacted are scattered across dynamic Dapps and immutable Smart Contracts on the blockchain. This creates a lot of problems when you try to implement business logic in a token. It either ends with being very primitive, or it causes complexity and security issues and reintroduces central point of failures. 

Therefore we introduce TokenScript, a program interface for tokenisation. It abstracts out the token information, access methods and UI rendering so that they can be efficiently marketised and used for integration. It allows different token providers to not only describe the features of their tokens but also how they are allowed to “act”, e.g. transferability. The crux of the idea is that such a markup description can be updated at any time by the token issuer and retroactively reflect the behaviour of already issued tokens. Besides allowing easy interoperability between different token providers, this also eliminates the need to update the DApp or smart contract whenever the business logic of a particular type of token changes.

Specifically, Tokenscript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token. TokenScript allows token logic and rendering to be separated out of the "host", making token easily portable and markets to be created for it.

## Tokenization
Blockchain technology has two primary functions that serve essential purposes for the future economy and the future Internet:

* providing a frictionless market; and
* integrating the web.

We call this process *Tokenization*. This paper addresses the vision of where we can be and follow up with the design and reasoning behind the architecture needed on top of the blockchain. 

### Creating a frictionless Market
The majority of markets is not integrated and operates with high costs. The stock market, for example, has so much overhead that it is only justifiable for multi-million dollar businesses which rely on the trust of rules and regulations to operate.

Nearly all markets operate still in the traditional intermediary-operated market model. A trade is made in two stages: entering the market, making a deal. With blockchain, any tokenised asset can be fastly transacted any time, without an intermediary. The buyers and sellers do not need to "enter" the market; instead, tokens are *always on the market*. A trade can start with the second step. 

This enables trades the frictions of the traditional market permitted. We can tokenize 1% of a property and create granular investments of all kind of ressources. We can tokenize electricity, allowing power users to benefit from finer scheduling of the use of resources. And so much more. 

Blockchain can provide the foundational layer to achieve these. But it requires a reliable and precise method to define how tokens should be used and transacted. Tokens must be categorised into *payment* and *deliverable* tokens. The commonly used ERC represents only the payment side of a trade. Often they just serve as a gift card, replacing other payment token. 

To trigger tokenization, tokens must be products. To be so they need to have different properties: Do tokens expire? Some do, some do not. Should the token owner receive a notification on a specific event? Is it stream-able? Is it related to identity information? How does it look on the user's mobile, and how is it called in a users language? Does it define a method to establish trusted communication between buyers and sellers?

### Integrating the web
Like markets, the internet as we know it is not integrated. A symptom of this is the need to manually do so often copy and pasting. This is not a flaw of the user experience design, but of the architecture of the web. It is organized like a giant library, and users are like readers keeping notes of the index numbers.

The smartphone, which was designed to be the most integrative and personal tool for browsing the web, did not solve the problem. It even made it worse, as copy-pasting becomes bigger trouble when using a Smart Phone. The effort from the client side alone can't integrate a Web that is not designed to integrate. 

The web lacks a built-in authentication mechanism. To route around this gab, many users use add-ons like "Sign in with Facebook". Those provide authentication through a trusted 3rd party, which does not only cause privacy and availability concerns, but is more of a stopgap instead of a solution. Most simple business cases don't require an account.

Another problem of disintegration of the web is the lack of a built-in mechanism for ownership, transfer of value and trading. Whenever ownership is involved, there needs to be a chain of bureaucratic procedures, which is pulled from account to account in the background - and each introduces another trusted third pary. Accounts can hide the problems of an disintegrated web - but they don't solve them. 

Both missing features - authentication and ownership - are well-known functions of the blockchain. In the internet of tokenization, tokens are the angle which integrate the web.

## Requirements for Tokenization

We strongly believe that it is inevitable that Tokenization will happen and will integrate both markets and the internet. But obviously, we are not here yet. There are thousands of token, and the ICO hype in 2017 raised billions of Dollar. But Tokenization did not even really start.

To fulfill the promise, tokens need to become a lot more sophisticated. An important part is that they serve not only on the payment, but also on the delivery side. There are several requirements tokens must match to enable Tokenization:

*1. Richness*

Tokenization means having a large variety of tokens, each tailored for its usecase, and each based on a rich foundation, structuring transaction rules, behaviour patterns and business logic. 

*2. Embeddedness*

Token must be able to interact with a large set of different systems, be it IoT devices, third party websites, wallets or other token and smart contracts. Tokenization only happens when token are embedded in this environment, while they are able to independently integrate this environment. All services, wallets and so on must be able to understand, address and react on every single event and action option of the token.

*3. Flexibility*

A token never has a finished state. It must be able to be upgraded to reflect the business environment and to adopt new protocols, like other smart contracts or plasma state channels. To be successfull, token must not be locked-in in one protocol or one state, but be able to react flexibly on the environment and technological achievements. Wallets and services must be able to adopt such changes of the token in an easy and fast manner. 

*4. Trust*

A token must carry trust relationship and business context to 3rd parties. There are many usecases in which a token is used to transport a permission or attestation, given from one party, to another. Only this enables token to integrate trust based services. This must not but can involve private data.

It should be noted that the achievement of this requirements must not disturb the strong basic security and trust properties of tokens based on a blockchain provides.

## The shortcomings of the established token system

What we define as the established token system is the model used by the large majority of existing token: They are based on a smart contract on Ethereum, defined by the ERC20 or the ERC21 standard. In this model, all behavioral rules of a token are put in a smart contract, while the users rely on hosted DApps to access functions which go beyond simple transactions. 

We argue that this method is not suitable for creating a frictionless market and integrating the web. Fulfilling the challenges with the conventional token model is difficult, often nearly impossible, while adding complexity and causing scalability, interoperability and security issues.

*1. Richness*

The business logic of a token - all kind of applications - are coded in a smart contract, and centralized websites enable users to access the contract. For example, you have an ERC721 crypto kitty token. To use it you must access the cryptokitties website.

This method requires the designers to fetch all possible business scenarios while it adds a lot of complexity to the code. The amount of complexity often causes security issues, as it happened with the DAO. This model can work, as shown by the MakerDAO, but in most cases it restricts the scope of rules around the token on trivial payment functionality.

*2. Embeddedness*

Ethereum token have a very limited way of interacting with other systems like wallets, DApps or smart contracts. If the logic of interaction is part of the smart contract, we have the problem that it increases the complexity or results in security issues. To let wallets reflect smart contract logics which are not represented in the contract itself, requires them to update for every new token. This doesn't scale.

Similarly, it is hard to allow a token to interact with other smart contracts. How can the token contract know about another contract before it is written? How can a wallet know how to let a user control this interaction?

The established solution for all cases of more complex token logics is to use a hosted DApp. For nearly everybody it is impossible to use the crypto kitty token or to take part in the MakerDAO without access to the websites. The advantage of integrating the web with token is lost when the user needs to rely on hosted webservices again. 

*3. Flexibility*

You can't predict how markets behave. Even if a smart contract developers lays out brillant incentives and rules for today's economy - it will not be able to compete in the future if it is not able to change. To allow tokens to become an integral part of the economy, you must update the business logic they present.

Also you need to adopt a token's transaction and behavioral logic to new smart contracts it can interact with and to new protocols, which are not fully written yet. For example, you might want to allow a token to be transfered with plasma sidechains. 

A smart contract which can't be upgraded makes most cases for tokenization impossible. There are methods to upgrade them, but it is difficult and complex and relies on another - immutable - smart contract. As the hack of parity's multi sig contract showed, this can introduce security issues. In general, it increases the complexity of the contract. 

*4. Trust relationships*

Carrying trust relationships with the legacy model of token casts two problems: First, you will have to input private data on a blockchain, which has, even when encrypted, several risks. Second, you need to carry the relationship over a hosted DApp, which means you are dependend on a website being online. If one part of a chain of trust relationships is offline, your token will not work.

To summon it: Tokens on Ethereum suffer from having their entire functionality derived from a smart contract. Some requirements of Tokenization are impossible to be fulfilled with this model. Some can only be achieved for the cost of increasing complexity and introducing security problems, which means that companies, which want to use tokens for a business case, will end with struggling with smart contract development instead of developing their business. Finally, some requriements can only be achieved for the price of desintegrating the web again by relying on hosted DApps.

Most of these shortcomings have one common denominator: There is a missing link between the smart contract and the user. This either depreciates the functionality of the smart contracts or reintroduces centralized hosted DApps filling the gap.

## Tokenscript as a solution
We propose Tokenscript as a solution to overcome the shortcomings of the legacy token model. Tokenscript stands for Token Behaviour Markup Language.

Tokenscript is a program interface for tokenisation. It is an XML dialect, which describes the functions of the token and the method to interact and render it on the user interface. It serves two purposes: It helps the user to access the token's full functionality - and it allows to create more advanced, complex and flexible user-token-interactions.

The XML dialect can be easily read by any device and software without the need to pull it into the core of the wallet structuring the interaction with the blockchain. It's also possible to use Tokenscript to perfom token actions on another protocol, without the need to migrate the token smart contract. The rules expressed with Tokenscript can be easily upgraded and adjusted.

Basically, Tokenscript puts a lot of information offchain, while the core of the token design remains on the chain and the Tokenscript information is signed by the token issuer. This makes it as verifiable as the smart contract itself, while being a set of shared data between the token issuer and it's users. In the context of current blockchain terminology it could be described as a Layer 2 technology for the interaction with token.

You can imagine it by thinking on a computer program for your music files: Like the token on a blockchain, the music files remain the same, but the software for playing them can change. It can be automatically updated to eliminate a bug, or it can change to allow new features, like recording, cutting or fine-tuning the audio frequences or putting it in a library of your favorite songs. Tokenscript is the hinge which connects the software with the token and makes sure that the interaction of both is not arbitrary, but structured by the issuer of the token.

To explain Tokenscript in mor details, we will fetch out design requirements by applying the concept on examples.


## Design requirements

The design requirements for Tokenscript need to cover both the challenges to integrate markets and the internet. 

For creating an integrated frictionless market we define *market* as the place where payment versus delivery happens: Someone pays with a money token and receives a deliverable in form of a token. Tokenscript must allow this process to happen frictionsless by allowing the issuers of delivery token to create and render a sophisticated business logic around the token, covering the needs of the market it integrates. At the same time, Tokenscript must enable wallets to easily understand and visualize the logic of the token and interact with it.

### Information on Deliverables

The scope of classes of deliverables is infinite. As an example we could think of a market for tokenized 1% shares of properties, which can be bought and sold on different marketplaces. For such a token the buyers accquiring such token need a wallet which can display and react on a large array of information. We categorize these information in four classes:

1. Product description: Voting rights of the property, payout specification of proceeds, condition for liquiditation in case of collaterialization of the property and so on.
2. Attested information: Place and status of the property, legal state of ownership, identity information
3. Reference information: Performance of property in this area, historical sales.
4. Action information (how to perform an asset action): How to build a transaction to acquire the property? How to vote with your share, how to sell it or offer it on a market?

Tokenscript must be able to allow issuers of deliverables to integrate and render those classes of information while enabling wallets to understand and visualize this information and transform it into adequate transactions. 

### Information for Payments

Similarly, with the advent of programmable money like Ether or DAI-Dollar, there are opportunities on the payment side. There can be automated payments, automated cashbacks and affiliates, advanced multisig payment and escrow schemes, payments with attached attestation information, automated exchange of token, management of collaterals when using stablecoins like token and much more.

Like the deliveries, the payment requires wallets to understand context and business logic of a payment to craft the correct transaction. This requires wallets to become much more sophisticated than what they are now. They must learn, visualize and use the underlying logic of complex payment operations. 

To enable wallets to exploit the potential of programmable payment token, tokenscript must process similar information categories as on the delivery side.

### Advantages to achieve 

There are several areas in which Tokenscript can achieve significant advantages: Interoperability, Scalability, Security, Privacy, User-Interface, Availability.

#### Interoperability

Tokenscript allows a token to maintain or change its underlying business logic compatible with many applications and wallet. It is a tool to enrich tokens with a complex business logic and make platforms, wallets or websites easily compatible with it, even when it is updated. Same counts for logics on the payment side.

#### Scalability

Scaling Ethereum requires to use second layer technologies like Plasma Sidechains. Tokenscript helps to allow fetching information about the token - and the chain on which it operates - without having a node that runs on all possible chains. It also allows to coordinate payment processes in which the payment token is not on the same chain as the delivery token. 

#### Security

Often it is hard for users to know the content of a transaction they sign. When transactions become more complicated - as they represent more complex transaction logics - it becomes hard for wallets and users to really know what they sign. In the end, users need to trust the website. With Tokenscript the level of required trust is reduced on the issuer of the Token.

#### Privacy

Some token business cases like the purchase of a property share could require the user to provide an identity proof. Without a tool like Tokenscript, it is very hard to do this without giving private data to a trusted third party, which is not directly part of the transaction, but coordinates it. Tokenscript can instruct the wallet how to send this data directly to the one needing it.

#### User-Interface

The more complex transaction and token logic gets, the harder it is for wallets to represent it and to update it. Imagine, you have 1000 token with 1000 individual business logics. Should the wallet developer integrate each one? Should the smart contract ABI cover every wallet or website implementation? Tokenscript markups allow wallets and other services to represent a rich set of information about a token, extend it with external information, implement action buttons and update the token logic.

#### Availability

In most cases, complex token logics - for example, Crypto Kitties - are accessed by a hosted DApp. This reintroduces the dependencies blockchain was meant to eliminate. It also introduces the integration through servers in the middle, when the token logic allows to integrate several parties, like using a car ownership token as an insurance token and a membership token for the road service. In this model the user is dependent on the availability of a certain server. With Tokenscript this can be bypassed, so that the use of a token does not rely on a single source of failure.

### Advantages to achieve (?)

### Requirements to integrate the web







