# TokenScript

**Bring context, security and cross platform (iOS, Android and Web) functionality to your favourite tokens with a single file.**

TokenScript makes SmartTokens (Credit to [Virgil Griffith](https://twitter.com/virgilgr) for coming up with the name ‘SmartToken’). These are like traditional ERC20 or ERC721 tokens but with extendable structure and signed JavaScript to go with it to realise rich functions that previously DApps struggle to implement, and be traded with flexible, customized trading rules.

A TokenScript file is made of a) JavaScript to make Token work in the user's wallet or across multiple apps and b) XML data to extract status and value of the token.

In short, it's like a secure front-end for tokens.

## Where can I find examples of already completed TokenScripts that I can use to create my own?
Visit our example repo [here](https://github.com/AlphaWallet/TokenScript-Examples) which is full of complete TokenScripts that run inside our wallet

## Don't we already have a front-end for tokens?

Yes, it's called DApp websites. But it's not portable and secure.

If everything the user wanted to do with that token is done on a DApp website, that token isn't very useful on other DApps. People used to cut out token functions, shoe-horn it to ERC20 or ERC721 to make it portable.

TokenScript of a token is like making _the dapp of the token_ portable and usable across multiple DApps. It further secures it with a sandboxed and code signed model.


The [TokenScript design paper](https://github.com/AlphaWallet/TokenScript/releases) outlines why TokenScript has to be portable for Tokenisation. The authors of the design paper holds that there is no tangible benefit of using blockchain without tokenisation.

## How is TokenScript created and used?

A TokenScript is typically created by the token's modeler, the team which builds the underlying smart contracts dictating the token's transaction rules.

When used by a user (through user-agent, e.g. a DApp browser) TokenScript visually renders the token and provides trustworthy assembling of transactions related to the token.

When used by a DApp developer, TokenScript allows a DApp to interact with its interface instead of directly accessing smart contracts, so that the DApp can be upgraded independently of all the tokens it supports.

When used by a market or any other token related service (e.g. an auction or collateralisation), it allows the token to be correctly rendered and signed for use with these services.

## What's in a TokenScript file?

TokenScript is an XML dialect. It describes the functions provided by the token (through smart contract or not), the method to render it on the user's interface, the ERCs token behaviour templates it uses and the JavaScript needed to construct transactions and render the token. It also defines how attestations are used to decorate, or convert to, or validate a transaction.

## Why TokenScript?

The team at AlphaWallet is committed to bringing Web 3.0 via tokenization. Tokenised rights can be traded on the market and integrated across systems, forming a [Frictionless Market](https://github.com/AlphaWallet/TokenScript/blob/master/doc/design_paper.md#creating-a-frictionless-market) and allowing limitless integration([Integrating the Web](https://github.com/AlphaWallet/TokenScript/blob/master/doc/design_paper.md#blockchain-integrates-the-web)).

Today, the way tokens are accessed, rendered and transacted are scattered across DApps and Smart Contracts. This limited the use of Tokens.

Typically, all knowledge about rendering a token and constructing a transaction about the token is in a "host" web app. The "host" web app becomes a centre in the token's marketisation and integration, recreating data interoperability, security and availability barrier - precisely the same set of issues that prevented tokenisation before blockchain's invention.

By taking the knowledge of tokens including smart contract interfaces out and put them into a portable TokenScript we allow tokens to be accessible and useful.

## Why use XML rather than JSON or some other JS format? 

It is helpful to think of the TokenScript file as a project file and the canonicalized version as the final distributable, build target.

XML has certain standards and tools that have been built over time that helps us here:

A. XML canonicalization (c14n) which specifies and provides a portable way to represent an XML file under transmission in an always identical format.

B. XML digital Signatures which is based on signing canonicalized XMLs.

C. XML allows developers to list and describe attributes and actions/transactions declaratively. While it's possible to do it with JSON, it would likely involve listing them in dictionary and string literals that are harder to enforce schema, validation and track schema changes.

D. standardized static types, with XML we can easily enforce ASN.1 variable encodings to ensure the variable is as defined. 

Used together, we can ensure that a given signed, canonicalized TokenScript file has not been tampered with. Without using XML, these crucial properties of XML have to be reinvented and made available. 

Ultimately, if we look at the TokenScript XML file as a project file, we can foresee that in the future, we might build tools to manage them instead of relying on editing the XML file directly, then how the file is itself being editable ceases to be that important and integrity of the file becomes more important.

## TokenScript Project introduction

The TokenScript project is an initiative to design, progress TokenScript and nurture the use of TokenScript.

## Git repo

This project holds:

doc
:   documents about the language and the design

schema
:   XML schema files which define the syntax for TokenScripts

## Donation Address
[0xdeadd42a3ab7d14626a98eadebd26ae8c81b07e4](https://etherscan.io/address/0xdeadd42a3ab7d14626a98eadebd26ae8c81b07e4)
