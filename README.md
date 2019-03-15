# TokenScript

TokenScript builds the front end logic of a token dapp with the smart contract on the backend. 

A TokenScript file contains a token's business logic, token UI rendering and program interface, signed by the token's modeller.

## Don't we already have a front-end for tokens?

In Ethereum, most tokens have a web application which serves all the content relevant to the token. Let's call it _the "Dapp" of the token_.

If everything the user wanted to do with that token is done on that website, then yes there is already a front-end for that token. But that token isn't very useful as a blockchain token, since it can't be used on other Dapps.

TokenScript of a token is like making _the dapp of the token_ portable and usable across multiple dapps. In this frameworkd, a dapp can provide services and context related to the token (e.g. you have one sword in the WoW dapp and an assault rifle in call of duty).

This distinction and separation is important for tokenisation - a concept addressed in [the design paper](https://github.com/AlphaWallet/TokenScript/releases). The authors of the design paper holds that there is no tangbile benifit of using blockchain without tokenisation.

## How is it created and used?

A TokenScript is created by the token's modeler, typically the team which builds the underlying smart contracts dictating the token's transaction rules.

When used by a user (through user-agent, e.g. a Dapp browser) Tokenscript visually renders the token and provides trustworthy assembling of transactions related to the token.

When used by a dapp developer, TokenScript allows a Dapp to interact with its interface instead of directly accessing smart contracts, so that the Dapp can be upgraded independently of all the tokens it supports.

When used by a market or any other token related service (e.g. an auction or collateralisation), it allows the token to be correctly rendered and signed for use with these services.

## What's in a TokenScript file?

TokenScript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token. It also defines how attestations are used to decorate, or convert to, or validate a transaction.

## TokenScript Project introduction: 

The TokenScript project is an initiative to help spread adoption of TokenScript. 

The remarkable blockchain speculations that took place in 2017 - 2018 brought everyone's attention to crypto tokens. As we bought and sold them, we forgot their intended purpose was to be used; this is analogous to the housing bubble in which people forgot that houses were not merely speculative assets but rather a place to live. To provide a practical use of the blockchain, we must understand its utility to the world economy and the internet. The people behind this project are technical experts who went through years of study and experimentation into its applications both via financial institutions and startups. With this experience, we recognise the blockchain technology's utility in providing a frictionless market and integrating the web.

Despite the great folly in 2017-2018, it is not a bad thing to initially focus on tokens. Tokens are the enabler of the two primary functions. We define the technique to make it happen in "Tokenisation". Tokenised rights can be traded on the market and integrated across systems, forming a frictionless market and allowing free integration. Previous efforts in this industry primarily focused on enriching the capacity of the technology. This project will focus on tokenisation and introduce a standardisation effort known as TokenScript (Token Behaviour Markup Language) which will make the blockchain technical stack complete, providing utility for the economy and the internet.

# Git repo

This project holds:

doc
:   documents about the language and the design

lib/browser
:   browser plugin-support of TokenScript

lib/web
:    library for Dapps to render tokens in the case the dapp-browser does not support TokenScript. Some features are not available (e.g. switching nodes or accessing multiple Plasma Chain) as they require underlying dapp browser support.
