# Project Charter 
-------------------------------------------

**INSTRUCTIONS FOR USE:** Ask the Open Projects Administrator to set up a page in our Draft Charters repository where you can publicly collaborate with others in the community. Alternatively, you may copy this template and complete your draft in private or in another public space.

-------------------------------------------

**This is a draft proposal.** It has not been submitted to or accepted
by OASIS. This charter must be finalized by its proposers and submission
requirements must be met before it can be considered for formation as an official 
[OASIS Open Project](http://oasis-open-projects.org). Contact the [Open Projects Administrator](mailto:op-admin@oasis-open.org) for details on this.


| Charter section | Section description. Replace with charter text. |
|-----------------------------------|-----------------------------------|
| **1. Project Name**   | TokenScript  |
| **1.1 Full Name**     | TokenScript - An opensource framework for defining the behavior of your tokens in a cross platform, dynamic, modular and secure way |
| **1.2 Familiar Name** | TokenScript |
**2. Abstract**   
Token standards like ERC20/ERC721 are appropriately simple in their definition for broad use. But with each implementation comes additional functionality unique to an application's features. To better represent this functionality, the TokenScript framework effectively extends a token's logic (from the author) into the app space where it is integrated.

**3. Purpose and Scope** 
 Today, tokens are best represented only in their dapp's website; losing the web3's promise of an integrated web, and returning to web2.0's lack of universal integration. A framework like TokenScript is necessary because siloing of functionality is occurring outside of smart-contracts. 
 The perfect example of this is Cryptokitties, while the NFT contract is decentralised and the token id is encoded with the genetic information, there is no easy way for anyone to extend this token for extra functionality, for example Cryptokitty [hats](https://kittyhats.co/#/). Furthermore, if the Cryptokitties website went down, the Cryptokitties themselves would lose all meaning; making the Cryptokitties service no better than an existing web2 service. 
 In future, users will expect to be able to seamlessly use services via tokens. They will not need to manually convert their DAI or KNC to make an ETH or dollar payment, this logic will be described in a file representing an underlying token and executed in real time. 
 TokenScript is a framework to define such token logic and have it be cryptographically signed by the original author. This will allow other developers to import such token functionality and extend it, while knowing it came from a credible source. 
 
**4. Business Benefits**

A token issuer who writes a TokenScript will immediately have mobile integration. They will not need to create their own wallet to serve their users and will have the ability in future to have their token serve their users in ways they cannot even imagine. Each TokenScript is signed by the issuer, meaning the user knows it comes from a valid source.

As a simple example, let's image you have an NFT contract which accepts donations of eth and gives back an NFT representing your donation. This NFT could entitle you to free drinks at a special bar or give you further information about where your donations are going. Such logic could easily be written in TokenScript and the author could instantly have it work on a holders mobile phone app. 

**More detailed example**  

Let's say you are a Token Issuer who issues tokens representing legal ownership of a house. Other service providers will be able to write TokenScripts which reference your token and offer services to the user such as housing insurance, the ability to AirBnB your house with another token or the ability to create a loan with your housing token as collateral. All such services will be renderable natively on the mobile or web and the original issuer may not even be aware of the services using their token. Users will be able to get these TokenScripts on the fly when using a service rather than going to a unified panel which can only guess what you want. 

As of 2019, the blockchain industry is still small and most dapps can fit on a small unified panel, like defisaver.com. This is similar to the early days of the internet whereby companies like CompuServe gave you a small dashboard which contained everything the internet could possible provide. As the internet got larger, such a service collapsed as users had too many options to choose from. The same thing is happening to day with blockchain services and we will need to progress from this, allowing users to dynamically use blockchain services as they browse. TokenScript hopes to capture this by being a simple module which the user can download on the fly, when using a service.                    
                   
**5. Relationship to Other Projects**  
A few token issuers already leverage TokenScript to represent their tokens inside our mobile wallet. 

- the xDAI/MakerDAO team has a bridge running inside AlphaWallet (currently the main implementor of TokenScript) [here](https://github.com/AlphaWallet/TokenScript-Repo/blob/master/aw.app/2019/05/DAI.tsml) and [here](https://github.com/AlphaWallet/alpha-wallet-ios/blob/master/xDaiTokenScript/XDAI-bridge.tsml)
- Compound has [TokenScript's](https://github.com/AlphaWallet/TokenScript/tree/master/examples/erc20/Compound) which enable users to invest or withdraw their funds from all compound services 
- Celer has signed a TokenScript for their [ERC20 token](https://github.com/AlphaWallet/TokenScript-Repo/blob/master/celer.network/2019/05/CELER.tsml) which gives peace of mind to their users that the token does in fact originate from them. This list is growing everyday 
 -bZx iDAI is a [TokenScript](https://github.com/AlphaWallet/TokenScript/tree/master/examples/erc20/iDAI) running inside our wallet and allows the user to earn interest. Later there may also be TokenScripts for leveraged investment tokens

**6. Repositories and Licenses** 
- [TokenScript](https://github.com/AlphaWallet/TokenScript) Apache 2.0
- [AlphaWallet iOS](https://github.com/AlphaWallet/alpha-wallet-ios) & [AlphaWallet Android](https://github.com/AlphaWallet/alpha-wallet-android) GPL (under review, this may change)

**7. Initial Contributions from Existing Work**

You can find all the projects currently using TokenScript [here](https://github.com/AlphaWallet/TokenScript/tree/master/examples) 

**8. Project Leadership**

**8.1 Project Governing Board**

Reprsentitives from implementations:
AlphaWallet - Victor Zhang - CEO and co founder

Rrepresentitives from TokenIssuers:
[missing]


**8.2  Technical Steering Committee**

| Nmae | Expertise | Location | Works |
|---|---|---|---|
| Weiwu Zhang (chair) | Tokenisation | Sydney, Australia | αWallet, formerly CBA (bank) blockchain architect|
| Dr Tore Kasper Frederiksen | Multi-party computation, zero-knowledge proof | Denmark  | [Papers](https://scholar.google.dk/citations?user=XnMVW7gAAAAJ) |
| Dr Nigel Sheridan-Smith | distributed systems, network protocols | Sydney, Australia | [Papers](https://www.semanticscholar.org/author/Nigel-Sheridan-Smith/2519329) |
| James Brown | compiler and virtual machine | Sydney, Australia| αWallet, former Sony (PS3) compiler and linker lead |
| Hwee Boon Yar | system interoperatbility and data exchange, mobile app | Singapore | αWallet, SimplyTweet (former App Store champion) |

**8.2 Other Contributors (Optional)** 

- Virgil Griffith - Executive cheerleader for TokenScript and creator of the "smart token" name :) [github](https://github.com/virgil)

---

When you are ready to submit this charter, notify [OASIS](mailto:op-admin@oasis-open.org). The Open Projects Administrator will ensure it is complete and meets all requirements.   

For more information, please see:

-   [Open Projects Handbook](../board-docs/open-projects-handbook.md)
-   [Open Project Rules](../board-docs/open-projects-rules.md)
-   [Open Projects Website](http://oasis-open-projects.org)
