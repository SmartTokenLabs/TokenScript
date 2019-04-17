# TokenScript

TokenScript makes SmartTokens (Credit to [Virgil Griffith](https://twitter.com/virgilgr) for coming up with the name ‘SmartToken’). These are like traditional ERC20 or ERC721 tokens but with extendable structure and signed JavaScript to go with it to realise rich functions that previously DApps struggle to implement, and be traded with flexible, customized trading rules.

A TokenScript file is made of a) JavaScript to make Token work in the user's wallet or across multiple apps and b) XML data to extract status and value of the token.

In short, it's like a front-end for tokens.

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

Today, the way tokens are accessed, rendered and transacted are scattered across DApps and Smart Contracts. This limited the use of Tokens.

Typically, all knowledge about rendering a token and constructing a transaction about the token is in a "host" web app. The "host" web app becomes a centre in the token's marketisation and integration, recreating data interoperability, security and availability barrier - precisely the same set of issues that prevented tokenisation before blockchain's invention.

By taking the knowledge of tokens including smart contract interfaces out and put them into a portable TokenScript we allow tokens to be accessible and useful.

## TokenScript Project introduction

The TokenScript project is an initiative to design, progress TokenScript and nurture the use of TokenScript.

# Git repo

This project holds:

doc
:   documents about the language and the design

lib/browser
:   browser plugin-support of TokenScript

lib/web
:    library for DApps to render tokens in the case the DApp-browser does not support TokenScript. Some features are not available (e.g. switching nodes or accessing multiple Plasma Chain) as they require underlying DApp browser support.

# Trying out TokenScript

Join our Telegram group <https://t.me/AlphaWalletGroup> and ask for "an example Admission Ticket Token to play with TokenScript". Tell us your Ethereum address so we can send you a token.

For iOS:

1. Install the TestFlight build by visiting <https://testflight.apple.com/join/aHUxcsro>
2. In the AlphaWallet app, go to Settings (last tab) > `Enabled Networks` and tap `Ropsten (test)` to enable it. Tap `Done`
3. In the AlphaWallet app, go to Wallet (first tab) and tap the `+` button and paste the contract address `0x0C8D487DD27D7c4A027D9f92915659139e0b2FF2` to make the wallet display the token which should have been transferred to you
4. Go to our repository at <https://github.com/AlphaWallet/TokenScript/tree/master/examples/ticket> and AirDrop the files `AdmissionTicket.xml`, `token.en.shtml`, `shared.css` and `enter.en.shtml` from your Mac to your iPhone. If you have access to the files in mobile Safari, you can also choose to "Open in AlphaWallet" from the iOS share menu
In the AlphaWallet app, go to Wallet tab and tap on the token "Admission Ticket Token (DAT2)"
6. In the AlphaWallet app, check the Settings tab > `TokenScript Overrides` for the list of TokenScript files. Swipe to delete or tap to share. You can AirDrop the files to another iPhone which has AlphaWallet TestFlight installed
