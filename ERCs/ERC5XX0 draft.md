### eip: 5???
### title: Client Script URI for Token Contracts
### description: Add a scriptURI to point to point to an executable script associated with the functionality of the token.
### author: James (@JamesSmartCell), Weiwu (@weiwu-zhang)
### discussions-to:
### status: Draft
### type: Standards Track
### category: ERC
### created: 2022-05-03
### requires: 
### Abstract
This ERC is a contract interface that adds a `scriptURI()` function for locating executable scripts associated with the token.

### Motivation
Often Smart Contract authors want to provide some user functionality to their tokens through client scripts. The idea is made popular with function-rich NFTs. By packaging a URI to an official script, created by the token minter, within the token itself, users can be sure they are using the correct script.

This ERC proposes adding a `scriptURI` which is a structure containing an array of URIs to external resources, such as in IPFS, GitHub, a cloud provider, etc., which will store the actual script.

Each `scriptURI` semantically contains access information to access a *single* signed script, stored in one or more off-chain locations.

Concretely each element in the array contains a URI to the script itself.

The script provides a client-side executable to the hosting token. Examples of such a script could be:

- A 'miniDapp', which is a cut-down dapp tailored for a single token.
- A 'TokenScript' which provides [T.I.P.S.](https://tokenscript.org/TIPS.html) from a browser wallet.
- An extension that is downloadable to the hardware wallet with an extension framework, such as Ledger.

It is expected that the return value of `scriptURI` is constantly updated to reflect the current latest version, if used. However, there is a way to assert the authenticity of signed client side code without frequently updating the URI. Developers should refer to ERC 5xx1 which detail a method of asserting code authenticity without relying on an URI. Note that both ERCs can be used together.

#### Script location

While the simplest solutions to facilitate specific script usage associated with NFTs, is clearly to store such a script on the smart contract. However, this has several disadvantages: 
1. The smart contract signing key is needed to make updates. This means that this key becomes more exposed as it is used more often. 
2. Updates require smart contract interaction. Simply posting a new transaction on Ethereum is not cheap! When this transaction also includes smart contract logic, the price can quickly become significant. If frequent updates are needed, then smart contract calls can in itself becomes a hurdle.
3. Storage fee. If the script is large, contains special graphics or other large elements, then updates to the script can quickly costs thousands of dollars.

For these reasons it makes sense to store volatile data, such as token enhancing functionality, on an external resource. Such an external resource can be either central hosted, such as a cloud provider or privately hosted with a private server, or decentralized such as the interplanetary filesystem.

While centralized storage for a decentralized functionality goes against the ethos of web3, fully decentralized solutions may come with speed or availability penalties. This ERC handle this this by allowing the token provider to store multiple URIs. It could also be a mix of centralized, individually hosted and decentralized locations.

While this ERC does not dictate the format of the stored script, it should be noted that the script itself could contain pointers to multiple other scripts and data sources, allowing for advanced ways to expand token scripts, such as lazy loading. The handling of integrity of such secondary data sources is left dependent on the format of the script. For example, HTML format uses [the `integrity` property](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity), while [signed XML format has `<Menifest/>`](https://www.w3.org/TR/xmldsig-core2/#sec-Manifest).


#### Authenticity

For validation of authenticity we consider two different cases:

1. The `scriptURI` points to decentralized immutable locations *or* the location itself contains information that can validate the authenticity of the script. For example, if the URI points to a location on a blockchain or if the latter part of the URI is a hash digest of the resource it points to, such as with IPFS. In the first situation the client (wallet) should assume it is authentic. In the latter, it case, the client must also validate that the hash describing the location also matches the hash of the script, though. 

2. If the `scriptURI` points to a dynamic location, the client must verify that the script downloaded has actually been issued by the same entity, which issued the token it is enhancing. The client must also warn the user against execution if this is not the case. However, this scenario is not covered by this ERC, but is handled by ERC 5XX1.


#### Script updates
Besides issues of script location, another issue is how the script can be updated in a manner where the caller can be sure it is authentic.

We address this issue by allowing the issuer to update the `scriptURI` on-chain, when the URI points to an immutable location or the URI itself contains info for script validation.

This ensures that the script can be changed, even in cases where the URI points to a location based on the hash digest of the script (which is the case if it is stored on the IPFS).

If instead the `scriptURI` points to a mutable location, it can be updated without on-chain interaction, as described in ERC 5XX1.

#### Overview

With the discussion above in mind we outline the solution proposed by this ERC. For this purpose we consider the following variables:
- `SCPrivKey`: The private signing key to administrate a smart contract implementing this ERC. Note that this doesn't have to be a new key especially added for this ERC. Most smart contracts made today already have an administration key to manage the tokens issued. It can be used to update the `scriptURI`.
- `script`: The script supplying additional functionality to the tokens.

With these variables in mind we can describe the life cycle of the `scriptURI` functionality:
- Issuance
1. The token issuer issues the tokens and a smart contract implementing this ERC, with the admin signing key for the smart contract being `SCPrivKey`.
2. The token issuer calls `setScriptURI` with the `scriptURI`.

- Update `scriptURI`
1. The token issuer store the desired `script` at all the new URI locations, and based on this, constructs a new `scriptURI` structure. 
2. The token issuer calls `setScriptURI` with the new `scriptURI` structure.


### Specification
The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY” and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

We define a scriptURI element using the `string[]`.
Based on this we define the smart contract interface below:
```
interface IERC5XX0 {
    /// @dev This event emits when the scriptURI is updated, 
    /// so wallets implementing this interface can update a cached script
    event ScriptUpdate(string[] memory newScriptURI);

    /// @notice Get the scriptURI for the contract
    /// @return The scriptURI
    function scriptURI() external view returns(string[] memory);

    /// @notice Update the scriptURI 
    /// emits event ScriptUpdate(scriptURI memory newScriptURI);
    function setScriptURI(string[] memory newScriptURI, bytes memory newSigScriptURI) external;
}
```
The interface MUST be implemented under the following constraints:

- The smart contract implementing `IERC5XX0` MUST store variables `address owner` in its state.

- The smart contract implementing `IERC5XX0` MUST set `owner=msg.sender` in its constructor.

- The `ScriptUpdate(...)` event MUST be emitted when the ```setScriptURI``` function updates the `scriptURI`.

- The `setScriptURI(...)` function MUST validate that `owner == msg.sender` *before* executing its logic and updating any state.

- The `setScriptURI(...)` function MUST update its internal state such that `currentScriptURI = newScriptURI`.

- The `scriptURI()` function MUST return the `currentScriptURI` state.

- The `scriptURI()` function MAY be implemented as pure or view.

- Any user of the script learned from `scriptURI` MUST validate the script is either at an immutable location, its URI contains its hash digest, or that it implements ERC 5XX1.

We note that while the interface specify batch updates of the `scriptURI`, developers can of course enhance the interface with other methods, adding more flexibility in how the `scriptURI` state is managed on-chain.

### Rationale
Using this method avoids the need for building secure and certified centralised hosting and allow scripts to be hosted anywhere: IPFS, GitHub or cloud storage.

### Backwards Compatibility
This standard is compatible with all Token standards (ERC20, 721, 777, 1155 etc).

### Examples
We here go through a couple of examples of where an authenticated script is relevant for adding additional functionality for tokens. 

1. A Utility NFT is a ticket and the authenticated script is a JavaScript 'minidapp' which asks the user to sign a challenge message that shows ownership of the key controlling the ticket. The dapp would then render the signature as a QR code which can be scanned by a ticketing app, which could then mark the ticket used (off-chain perhaps).

2. Smart Token Labs uses a framework called TokenScript; one element of which is a user interface description for contract interaction.
Simple example: definition for a 'mint' function. This is a simple verb description similar to a JSON contract ABI definition; where the script gives the verb "Mint" and defines how the contract is called - in this case the contract function name 'mint' and attached value for mint fee. In use: for example a Punks v(x) owner wants to mint another punk, the owner can open their punks in wallet or on supported websites and there will be a 'Mint' verb on the token which when clicked will mint a new Punk without needing to reference the mintFee or connect a wallet etc.

3. A Smartlock controlling NFT script which defines an HTML view and two verbs "lock" and "unlock". Each verb has a JavaScript control script. When the token is selected, the HTML view would be displayed and an attached JavaScript would fetch a challenge string from the lock controller. When each verb is selected by the user in the hosting app or website, the relevant script attached to the verb would execute, prompting the user to sign the challenge then sending the challenge to the lock controller, which would reply with a pass or fail and execute an action accordingly. This is an off-chain example that uses on-chain assets for functionality.

### Test Cases
Test Contract
pragma solidity 0.8.10;
import "./IERC5XX0.sol";

... TODO


### Security Considerations
No security issues found.
