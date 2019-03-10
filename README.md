# Tokenscript

Tokenscript is a program interface for tokenisation.

A token's modeler, typically the author of smart contracts dictating
the token's transaciton rules, writes tokenscript and signs it.

Both a Dapp browser and a web application (called Dapp in Ethereum)
make use of such a signed Tokenscript to visually render the token and
provide trustworthy signed transactions about the token.

## Why Tokenscript?

Today, the way tokens are accessed, rendered and transacted are scattered across Dapps and Smart Contracts. All knowledge about rendering a token and constructing a transaction about the token, is in a "host" DApp. The "host" DApp becomes a center in the token's marketization and integration, recreating data interoperability, security and availability barrier - exactly the same set of issues that prevented tokenisation before blockchain was invented.

TokenScript allows token logic and rendering to be seperated out of the "host", allows token to be easily portable and market to be easily created for it.

It allows different token providers to, not only describe the features of their tokens but also how they are allowed to “act”, e.g. transferability. The crux of the idea is that such a markup description can be updated at any time by the token issuer and retroactively reflect the behaviour of already issued tokens. Besides allowing easy interoperability between different token providers, this also eliminates the need to update the DApp or smart contract whenever the business logic of a particular type of token changes.

## What's in a token script

Tokenscript is a XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the javascript needed to construct transactions and render the token.

## TokenScript Project introduction: 

TokenScript Project is to develop and help with adoption of TokenScript, the standard markup language for creating and using cryptographic tokens(e.g. blockchain tokens) and DApps.

The remarkable blockchain speculations that took place in 2017 - 2018 brought everyone's attention to crypto tokens. As we bought and sold them, we forgot their intended purpose was to be used; this is analogous to the housing bubble in which people forgot that houses were not merely speculative assets but rather a place to live. To provide a practical use of the blockchain, we must understand its utility to the world economy and the internet. The people behind this project are technical experts who went through years of study and experimentation into its applications both via financial institutions and startups. With this experience, we recognise the blockchain technology's utility in providing a frictionless market and integrating the web.

Despite the great folly in 2017-2018, it is not a bad thing to initially focus on tokens. Tokens are the enabler of the two primary functions. We define the technique to make it happen in "Tokenisation". Tokenized rights can be traded on the market and integrated across systems, forming a frictionless market and allowing free integration. Previous efforts in this industry primarily focused on enriching the capacity of the technology. This project will focus on tokenisation and introduce a standardisation effort known as Tokenscript (Token Behaviour Markup Language) which will make the blockchain technical stack complete, providing utility for the economy and the internet.


## Git repo

This project holds:

doc
:   documents about the language and the design

lib/brower
:   browser plugin-support of Tokenscript

lib/web
:    library for Dapps to render tokens in the case the dapp-browser does
not support Tokenscript. Some features are not available
(e.g. switching nodes or accessing multiple Plasma Chain) as they
require underlying dapp browser support.
