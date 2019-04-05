// This is a short version of a design paper, which takes the most important points and describes Tokenscript from an abstract, low-level point of view.

## Abstract
We recognise the blockchain technology's utility in providing a frictionless market and integrating the web. This is done through tokenisation. Tokenised rights can be traded on the market and integrated across systems, forming a frictionless market and allowing free and accountless integration.

Today, the ways tokens are accessed, rendered and transacted are scattered across dynamic Dapps and immutable Smart Contracts on the blockchain. Most tokens either have a very primitive business logic or try to put complex logics into the contract to cater the interactions with the token. This adds complexity and security issues, while hardly addressing all potential business patterns in advance. When marketisation and integration of a token is tied to a dapp, it recreates data interoperability, security and availability barrier - the same issues that prevented tokenisation before blockchain's invention.

Therefore we introduce Tokenskript, a program interface for tokenisation. It abstracts out the token information, access methods and UI rendering so that they can be efficiently marketised and used for integration. It allows different token providers to not only describe the features of their tokens but also how they are allowed to “act”, e.g. transferability. The crux of the idea is that such a markup description can be updated at any time by the token issuer and retroactively reflect the behaviour of already issued tokens. Besides allowing easy interoperability between different token providers, this also eliminates the need to update the DApp or smart contract whenever the business logic of a particular type of token changes.

Specifically, Tokenscript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token.

TokenScript allows token logic and rendering to be separated out of the "host", allows token to be easily portable and market to be created for it.

It allows different token providers to, not only describe the features of their tokens but also how they are allowed to “act”, e.g. transferability. The crux of the idea is that such a markup description can be updated at any time by the token issuer and retroactively reflect the behaviour of already issued tokens. Besides allowing easy interoperability between different token providers, this also eliminates the need to update the DApp or smart contract whenever the business logic of a particular type of token changes.


## Tokenization
Blockchain technology has two primary functions that serve essential purposes for the future economy and the future Internet:

    providing a frictionless market; and
    integrating the web.

We call this process *Tokenization*. This paper addresses the vision of where we can be and follow up with the design and reasoning behind the architecture needed on top of the blockchain. We explain Tokenscript which is a critical missing layer and go over its design principles and how we are building it.

### Creating a frictionless Market
However, despite this web 2.0 revolution, the majority of markets still operate with high costs. The stock market, for example, has so much overhead that it is only justifiable for multi-million dollar businesses which rely on the trust of rules and regulations to operate.

With blockchain, any tokenised asset can be fastly transacted any time, as long as it follows the rules, without an intermediary, eliminating frictions and enabling maximum market efficiency. The buyers and sellers do not need to "enter" the market; instead, tokens are always on the market.

With the traditional intermediary-operated market model, a trade is made in two stages: entering the market, making a deal. Blockchain can simplify that into a protocol; therefore the blockchain token assets can be considered always on the market.

Can we tokenise 1% of a property, so that we have a finer property market with lower entry thresholds, which react faster than the typical month-long property purchase-sales cycle? Can token create a market of granular investments in all kind of resources?

Can we tokenise electricity, allowing power users to benefit from finer scheduling of the use of resources, and households to benefit from collecting surplus sun energy?

Blockchain can provide the foundational layer to achieve these. It enables a working, frictionless market with tokenised assets always on the market. However, this can only become true when there is a reliable and precise method to define how tokens should be used and transacted. This the focus of our work on Tokenscript.

In 2017-2018 we did end up having hundreds of tokens. However, they uniformly fall into one category of token: created with the ERC20 standard they are currency-like, filling up the payment side of the market. There is nearly zero effort devoted to making tokens goods and services - which is the deliverable side of the market and a fundamental need for a market to work.

We categorise tokens as payment tokens and deliverable tokens. ERC20 tokens bearing the hallmarks of payment tokens only fills one side of the market with tokens. They can't lift the market, as they merely compete with other payment-token - like Bitcoin or Ether - on the payment side. They represent a good, but they do not actually deliver. They are rather gift cards.

During the speculative bubble of 2017, an energy token ICO did not need to provide any explanation of how the tokens can be used. All speculators needed to know is that they represent for example a "stake in the future world of tokenised electricity". As long as the token can inspire investors with imagination, it's good enough for an ICO. There is no more functionality needed other than an ERC20 interface.

Tokens can be products. Therefore they need to have different properties: Do tokens expire? AirBNB booking tokens certainly do, but 1% ownership of property tokens probably don't. Should the token owner receive a notification on a specific event? An energy token needs that, for the change in the power supply is dynamic. Is a token stream-able?

How does it look on the user's mobile, and how is it called in a users language? If a buyer wants to purchase a tokenised country estate from a seller, how do they establish a trusted method of communication? If a token entitles the user to do specific actions online, how can the user login to the web services with that token?

It's easy to see the need for an open framework defining tokens and making them interoperable with different methods of trading, listing and rating. Tokenscript provides such a framework. It overcomes the limitation of the approach to put everything in a smart contract or a set of smart contracts.

### Integrate the web

Why are we doing so much copy and pasting when machines are exceptionally good at doing this? Owning to the design, the web is like a giant library, and we are like readers keeping notes of the index numbers under our sleeves. We hope that in the future the Web resembles no longer of a library, but more like a personal assistant.

Surprisingly, even the technology that was created to fill the role of a personal assistant, the Smart Phone, still failed for the same reasons: the efforts from client side alone can't integrate a Web that is not designed to integrate. It made the problem even worse, as copy-pasting becomes bigger trouble when using a Smart Phone.

The truth is: Not only the client but the infrastructure has to support integration. A smartphone is modelled after a dial-up Internet connection, with each app representing a website. The users still need to figure out which computer (app) to talk to before entering the conversation, and still copies information around as he swaps apps around. It's therefore not possible, for example, to ask your smartphone to sum up all the money one may access by his online banking apps.

The web doesn't have a built-in authentication mechanism[^tls]. To route around this gab, many users use add-ons like "Sign in with Facebook". Those merely try to provide authentication through a trusted 3rd party, which does not only cause privacy and availability concerns but also only serves for account authentication and can't be used for integration.

On top of it, the model of account based authentification is the cause of further problems. Most simple business cases - for example, "the owner of a car checks its service history" - don't require an account. Truthfully, accounts are stopgaps to problems created by the specific structure of the Internet as we know it.

The web doesn't have a built-in mechanism for ownership, transfer of value and trading.

Is it possible to make it happen, that the entire chain of bureaucratic procedures happens securely in the backend, while you just push the "buy" button? With the web of accounts, you'd need to knot together a lot of accounts and trusted third parties, which hide the process from the user, while they fulfil the same paper trail as before.*

In contrast, when you base the same process on a blockchain and on tokens, it would be automatic, fraud-proof[^attestations] and atomic[^atomic]. You could finish a car sell with one click in a secure way without the need for accounts and paper trails.

These missing features of the web are the well-known functions of the blockchain. A blockchain is an immutable, decentralized record of ownership, sometimes called a "triple-entry bookkeeping" system. The virtual wedding of this perfect fit couple requires a virtual exchange of tokens, or what this paper called "tokenisation".

To do so, Token must seamlessly go across systems, carry their trading rules and user interfaces and business context.

## Requirements for Tokenization

The car ownership example demonstrated the power of tokenization to errect a frictionless market and to integrate digital services. However, the way, tokens are used today, as it manifestated in the ICO hype of 2017/18, is far off from providing what we call tokenization. Most token don't even try to be more than a surplacement for the payment side.

To unleash their potential, tokens need to become a lot more sophisticated and fill the delivery side. Several requirements must be fulfilled to enable this:

1. Tokenisation means representing all kind of assets as a token on a blockchain
This requires bundling a token with its transactions rules and behaviour patterns. New tokens should be able to enter the ecosystem on an abstracted layer, so that they can be traded and used in different contexts. With the anticipated proliferation of new plasma subnets, token shold also be able to seemlessly operate on them.

2. Tokenisation must allow users to interact with different systems through the tokens
In the car example, the car token contains code to interact with a smart lock (the Open, Start, Lock actions) and the maker's own web service (the Locate action). The List for sharing is provided by another third party service which tokenises the usage of the car by hours or days and sells them piecemeal. The token needs to work in other environments and be used by different services - while the owner must be able to access all those markets solely through this Token.

3. A token must be renderable and associate with the actions it can perform in the user's wallet
In the car example, if the registration expired, the web component at work would paint the Registration Token red or display a warning. Actions like List for sharing will not be available with an expired car rego, and the integrated token interface should clearly pass that message to the user. Token must be rendered differently according to what happened to them in the user's wallet.

4. It must allow new protocols to be developed on tokens
A token never has a finished state. There are always options to attach new protocolls on it. In the property example, collateralization might be something wishful to add later, or identity information or the ability to transfer the token through plasma state channels. This has to reflect in the user interface, thus there must be a way to deploy trusted code to the user-agent's wallet or prefered dapp.

5. A token must carry trust relationship and business context to 3rd parties
In the car example, the insurance token provides Roadside Assistance service through NRMA. The driver might be able to access this through the token of his insurance provider and immediately be identified as qualified for help. In both examples the token must carry trust relationships, which shouldn't depend on the availability of a certain service, but passed directly by the token. Both business context as well as the relationsship must be part of the token, while being highly available, private and integrative. [^abc].

[^abc]: Availability: NRMA is online 24/7 but Qantas Insurance can suspend their services in public holidays or at night. Privacy: NRMA can learn user's GPS location but Qantas Insurance isn't legally allowed to learn it. Integration: Most of NRMA's customers are not obtained through Qantas Insurance, so it would be an additional system to integrate and extra security concern for NRMA to integrate to Qantas Insurance's web service. Of all three, availability might be the most visible. Just imagine how angry a customer will be, having his car breaking down in the middle of the barren Australian outback, and learn that the road-side assistance can't be authorised because the insurer's web service is upgrading "For a better user experience".

## The shortcomings of the established token system

The commonly used tokens on Ethereum put everything in a smart contract on a chain and often rely on a hosted DApp to access its functions. We argue that this method is not suitable for creating a frictionless market and integrating the web. Fulfilling the challenges with the conventional token model is difficult, often nearly impossible, while adding complexity and causing scalability, interoperability and security issues.

Bundling a token with business logic, trust relationship and transactions rules
In the world of Ethereum - the de facto standard for token - this is usually done with DApps: The business logic of a token - all kind of applications - are coded in a smart contract, and centralized websites enable users to access the contract. For example, you have an ERC721 crypto kitty token. To use it you must access the cryptokitties website.

This method requires the designers to fetch all possible business scenarios while it adds a lot of complexity to the code. The amount of complexity often causes security issues. There are a lot of examples on Ethereum how this concept can go wrong, which is why the Ethereum community restricted itself to only implement very limited behavior patterns in smart contracts. Creating a new token requires a developer to create an entire smart contract.

Another problem which often emerges is the upgrade of a token's business logic. Nobody can know in advance every kind of application and context of token transfers. To reflect this, it is possible to upgrade Ethereum smart contracts. However, this adds complexity to the code and just moves the un-upgradability to the upgrade-contract. As the incident on Parity's multisig contract demonstrated, this adds another security issue.

Interacting with different systems and rendering tokens in a wallet
Ethereum token have a very limited way of interacting with other systems like wallets or dapps. If the logic of interaction is part of the smart contract, we have the problems of 1. and to deal with the fact that you can't represent all systems language in one contract. It is impossible to do this without the help of external frameworks. Currently this is solved by using hosted DApps on websites, which structure the interaction between users and smart contracts. However, this reintroduces the centralization problems Blockchain was made to solve.

Very similar is the problem that events in the token history must trigger actions in the user interface. It is hard to do this, when the smart contract doesn't define the behaviour of all those systems in a way they understand. It's also hard to do so when a contract is upgraded. The usual solution is, again, to use a hosted DApp.

Allowing new protocols on the token
The inflexibility and immutability of a smart contract tokens makes it hard to allow to develop new protocols for it, especially when those protocols are not known when the contract is written. You will also need your smart contract to interact with other smart contracts in a way you can't predict when designing it.

This could end with a locked-in-state of the token on one certain protocol. It could also introduce trusted third parties to migrate to other protocols or to interact with other smart contracts or tokens.

Trust relationships
Carrying trust relationships with the legacy model of token casts two problems: First, you will have to input private data on a blockchain, which has, even when encrypted, several risks. Second, you need to carry the relationship over a hosted DApp, which means you are dependend on a website being online. If one part of a chain of trust relationships is offline, your token will not work.

To summon it: Tokens on Ethereum suffer from having their entire functionality derived from a smart contract. This introduces inflexibility, complexity, security and privacy issues and lacks of interoperability and makes it hard to upgrade the business logic to reflect experiences of the real economy. It is also a major issue to reflect the functionality of a token in a wallet, especially when certain token events must create wallet events. These problems often make business trying to integrate markets by using token end with spending all their resources on developing smart contracts.

Most of these shortcomings have one common denominator: There is a missing link between the smart contract and the user. This either depreciates the functionality of the smart contracts or reintroduces centralized hosted DApps filling the gap.

## Tokenscript as a solution
We propose Tokenscript as a solution to overcome the shortcomings of the legacy token model. Tokenscript stands for Token Behaviour Markup Language.

Tokenscript is a program interface for tokenisation. It is an XML dialect, which describes the functions of the token and the method to interact and render it on the user interface. It serves two purposes: It helps the user to access the token's full functionality - and it allows to create more advanced and complex user-token-interactions.

The XML dialect can be easily read by any device and software without the need to pull it into the core of the wallet structuring the interaction with the blockchain. It's also possible to use Tokenscript to perfom token actions on another protocol, without the need to migrate the token smart contract.

Basically, Tokenscript puts a lot of information offchain, while the core of the token design remains on the chain and the Tokenscript information is signed by the token issuer. This makes it as verifiable as the smart contract itself, while being a set of shared data between the token issuer and it's users. In the context of current blockchain terminology it could be described as a Layer 2 technology for the interaction with token.

You can imagine it by thinking on a computer program for your music files: Like the token on a blockchain, the music files remain the same, but the software for playing them can change. It can be automatically updated to eliminate a bug, or it can change to allow new features, like recording, cutting or fine-tuning the audio frequences or putting it in a library of your favorite songs. Tokenscript is the hinge which connects the software with the token and makes sure that the interaction of both is not arbitrary, but structured by the issuer of the token.

To explain Tokenscript in mor details, we will fetch out design requirements by applying the concept on examples.


## Design requirements
