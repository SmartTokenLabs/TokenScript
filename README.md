# TokenScript

TokenScript makes SmartTokens(Credit to Virgil Griffith for coming up with the name ‘SmartToken’). These are like traditional ERC20 or ERC721 tokens but with extendable structure and signed Javacript to go with it to realise rich functions that previously dapps struggle to implement; and be traded with flexible, customized trading rules.

A TokenScript file is made of a) Javascripts to make Token work in the user's wallet or across multiple apps and b) a set of XML data to extract status and value of the token.

In short, it's like a front-end of tokens.

## Don't we already have a front-end for tokens?

Yes, it's called Dapp websites. But it's not portable and secure.

If everything the user wanted to do with that token is done on a dapp website, that token isn't very useful on other Dapps. People used to cut out token functiions, shoe-horn it to ERC20 or ERC721 to make it portable.

TokenScript of a token is like making _the dapp of the token_ portable and usable across multiple dapps. It further secures it with a code signing model and a sandbox model.


The desige paper [the design paper](https://github.com/AlphaWallet/TokenScript/releases) outlined why TokenScript has to be portable for Tokenisation. The authors of the design paper holds that there is no tangbile benifit of using blockchain without tokenisation.

## How is a Tokenscript created and used?

A TokenScript is typically created by the token's modeler, the team which builds the underlying smart contracts dictating the token's transaction rules.

When used by a user (through user-agent, e.g. a Dapp browser) Tokenscript visually renders the token and provides trustworthy assembling of transactions related to the token.

When used by a dapp developer, TokenScript allows a Dapp to interact with its interface instead of directly accessing smart contracts, so that the Dapp can be upgraded independently of all the tokens it supports.

When used by a market or any other token related service (e.g. an auction or collateralisation), it allows the token to be correctly rendered and signed for use with these services.

## What's in a TokenScript file?

TokenScript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token. It also defines how attestations are used to decorate, or convert to, or validate a transaction.

## Why Tokenscript?

Today, the way tokens are accessed, rendered and transacted are scattered across Dapps and Smart Contracts. This limited the use of Tokens.

Typically, all knowledge about rendering a token and constructing a transaction about the token is in a "host" web app. The "host" web app becomes a centre in the token's marketisation and integration, recreating data interoperability, security and availability barrier - precisely the same set of issues that prevented tokenisation before blockchain's invention.

By taking the knowledge of tokens including smart contract interfaces out and put them into a portable Tokenscript we allow tokens to be accessible and useful.

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
