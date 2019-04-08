// This is a short version of a design paper, which takes the most important points and describes Tokenscript from an abstract, low-level point of view.

## Abstract
We recognise the blockchain technology's utility in providing a frictionless market and integrating the web. This is done through  a process we call *tokenisation*. 

However, the way tokens are used today does not fulfill the requirements for tokenization. Tokens are accessed, rendered and transacted are scattered across dynamic Dapps and immutable Smart Contracts on the blockchain. This creates a lot of problems when you try to implement business logic in a token. It either ends with being very primitive, or it causes complexity and security issues and reintroduces central point of failures. 

Therefore we introduce Tokenskript, a program interface for tokenisation. It abstracts out the token information, access methods and UI rendering so that they can be efficiently marketised and used for integration. It allows different token providers to not only describe the features of their tokens but also how they are allowed to “act”, e.g. transferability. The crux of the idea is that such a markup description can be updated at any time by the token issuer and retroactively reflect the behaviour of already issued tokens. Besides allowing easy interoperability between different token providers, this also eliminates the need to update the DApp or smart contract whenever the business logic of a particular type of token changes.

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

The car ownership example demonstrated the power of tokenization to errect a frictionless market and to integrate digital services. However, the way, tokens are used today, as it manifestated in the ICO hype of 2017/18, is far off from providing what we call tokenization. Most token don't even try to be more than a surplacement for the payment side.

To unleash their potential, tokens need to become a lot more sophisticated and fill the delivery side. Several requirements must be fulfilled to enable this:

1. Richness

Tokenization means having a large variety of tokens, each tailored for its usecase, and each based on a rich foundation, structuring transaction rules, behaviour patterns and business logic. 

2. Embeddedness

Token must be able to interact with a large set of different systems, be it IoT devices, third party websites, wallets or other token and smart contracts. Tokenization only happens when token are embedded in this environment, while they are able to independently integrate this environment. All services, wallets and so on must be able to understand, address and react on every single event and action option of the token.

3. Flexibility

A token never has a finished state. It must be able to be upgraded to reflect the business environment and to adopt new protocols, like other smart contracts or plasma state channels. To be successfull, token must not be locked-in in one protocol or one state, but be able to react flexible on the environment and technological achievements. Wallets and services must be able to adopt such changes of the token in an easy and fast manner. 

4. Trust

A token must carry trust relationship and business context to 3rd parties. There are many usecases in which a token is used to transport a permission, given from one party, to another. Only this enables token to integrate trust based services. This must not but can involve private data.

It must be noted that the achievement of this requirements must not disturb the basic security and trust properties a token based on a blockchain provides.

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
