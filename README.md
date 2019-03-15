# TokenScript

A TokenScript builds the front end of a token while smart contracts are the backend of a token.

A TokenScript file contains a token's business logic, token UI rendering and program interface, signed by the token's modeller.

## Isn't dapp the front end of a token?

Today, each token has a "home" dapp, let's call it "hosting" dapp.

If everything user has to do with that token is done on that hosting dapp, then the hosting dapp is all needed for a token front. However, one might wonder why such 2-party game (use r<-> hosting dapp) needs to use smart contract tokens at all.

Tokenscript is similiar to taking the "hosting" app and make it portable. In the Tokenscript framework, Dapps provide services using or related to the token. Such distinction and separation between Tokenscript and Dapp is important for the two primary functions of blockchain: *building a frictionless market* and *integrate the web*. More about that in the design paper.

## How is it created and used?

A TokenScript is created by the token's modeler, typically the team which builds the underlying smart contracts dictating the token's transaction rules.

When userd by a user (through user-agent, e.g. a Dapp browser) Tokenscript visually render the token and provide trustworthy assembling of transactions related to the token.

When used by a dapp developer, Tokenscript allows a Dapp to interact with its interface instead of directly accessing smart contracts, so that the Dapp can be upgraded independently of all the tokens it supports.

When used by a market or any other token related services (e.g. auction, collateralisation), it allows token to be correctly rendered and signed for use with these services.

## What's in a TokenScript file?

TokenScript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token. It also defines how attestations are used to decorate, or convert to, or validate a transaction.

## TokenScript Project introduction: 

TokenScript Project is to develop and help with adoption of TokenScript, the standard markup language for creating and using cryptographic tokens(e.g. blockchain tokens) and DApps.

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
