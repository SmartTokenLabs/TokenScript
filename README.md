# TokenScript

TokenScript builds the front end logic of a token dapp with the smart contract on the backend. 

A TokenScript file contains a token's business logic, token UI rendering and program interface, signed by the token's modeller.

## Don't we already have a front-end for tokens?

In Ethereum, most tokens have a web application which serves all the content relevant to the token. Let's call it _the "Dapp" of the token_.

If everything the user wanted to do with that token is done on that website, then yes there is already a front-end for that token. But that token isn't very useful as a blockchain token, since it can't be used on other Dapps.

TokenScript of a token is like making _the dapp of the token_ portable and usable across multiple dapps. In this frameworkd, a dapp can provide services and context related to the token (e.g. you have one sword in the WoW dapp and an assault rifle in call of duty).

This distinction and separation is important for tokenisation - a concept addressed in [the design paper](https://github.com/AlphaWallet/TokenScript/releases). The authors of the design paper holds that there is no tangbile benifit of using blockchain without tokenisation.

## Why Tokenscript?

Today, the way tokens are accessed, rendered and transacted are scattered across Dapps and Smart Contracts. This limited the use of Tokens.

Typically, all knowledge about rendering a token and constructing a transaction about the token is in a "host" web app. The "host" web app becomes a centre in the token's marketisation and integration, recreating data interoperability, security and availability barrier - precisely the same set of issues that prevented tokenisation before blockchain's invention.

By taking the knowledge of tokens including smart contract interfaces out and put them into a portable Tokenscript we allow tokens to be accessible and useful.

## How is a Tokenscript created and used?

A TokenScript is typically created by the token's modeler, the team which builds the underlying smart contracts dictating the token's transaction rules.

When used by a user (through user-agent, e.g. a Dapp browser) Tokenscript visually renders the token and provides trustworthy assembling of transactions related to the token.

When used by a dapp developer, TokenScript allows a Dapp to interact with its interface instead of directly accessing smart contracts, so that the Dapp can be upgraded independently of all the tokens it supports.

When used by a market or any other token related service (e.g. an auction or collateralisation), it allows the token to be correctly rendered and signed for use with these services.

## What's in a TokenScript file?

TokenScript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token. It also defines how attestations are used to decorate, or convert to, or validate a transaction.

## TokenScript Project introduction

The TokenScript project is an initiative to design, progress Tokenscript and nurture the use of Tokenscript.

# Git repo

This project holds:

doc
:   documents about the language and the design

lib/browser
:   browser plugin-support of TokenScript

lib/web
:    library for Dapps to render tokens in the case the dapp-browser does not support TokenScript. Some features are not available (e.g. switching nodes or accessing multiple Plasma Chain) as they require underlying dapp browser support.
