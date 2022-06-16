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

Often, Smart Contract authors want to provide some user functionality to their tokens through client scripts. The idea is made popular with function-rich NFTs.

Users can be sure they are using the correct script through the contract author packaging a URI to an official script, made available with a call to the token contract itself.

This ERC proposes adding a `scriptURI`, a structure containing URIs to external resources, such as in IPFS, GitHub, a cloud provider, etc., to store the client script.

Each token contract has one `scriptURI`  function, which points to a client script stored in one or more URIs.

Concretely each element in the array contains a URI to the script itself.

The script provides a client-side executable to the hosting token. Examples of such a script could be:

- A 'miniDapp', which is a cut-down dapp tailored for a single token.
- A 'TokenScript' which provides [T.I.P.S.](https://tokenscript.org/TIPS.html) from a browser wallet.
- An extension that is downloadable to the hardware wallet with an extension framework, such as Ledger.

The return value of `scriptURI` is expected to be constantly updated to reflect the current latest version, if used. However, there is a way to assert the authenticity of signed client side code without frequently updating the URI. Developers should refer to ERC 5xx1, which details a method of asserting code authenticity without relying on URIs. Note that the two ERCs can be used separately or together.

#### Script location

While the most straightforward solution to facilitate specific script usage associated with NFTs, is clearly to store such a script on the smart contract. However, this has several disadvantages: 

1. The smart contract signing key is needed to make updates, causing the key becomes more exposed as it is used more often. 

2. Updates require smart contract interaction. If frequent updates are needed, smart contract calls can become a hurdle.

3. Storage fee. If the script is large, updates to the script will be costly. A client script is typically much larger than a smart contract.

For these reasons, storing volatile data, such as token enhancing functionality, on an external resource makes sense. Such an external resource can be either central hosted, such as a cloud provider or privately hosted with a private server, or decentralized, such as the interplanetary filesystem.

While centralized storage for a decentralized functionality goes against the ethos of web3, fully decentralized solutions may come with speed or availability penalties. This ERC handles this by allowing the function `ScriptURI` to return multiple URIs. It could also be a mix of centralized, individually hosted and decentralized locations.

While this ERC does not dictate the format of the stored script, the script itself could contain pointers to multiple other scripts and data sources, allowing for advanced ways to expand token scripts, such as lazy loading. The handling of the integrity of such secondary data sources is left dependent on the format of the script. For example, HTML format uses [the `integrity` property](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity), while [signed XML format has `<Menifest/>`](https://www.w3.org/TR/xmldsig-core2/#sec-Manifest).

#### Authenticity

For validation of authenticity, we consider two different cases:

1. The `scriptURI` points to decentralized immutable locations *or* the location itself contains information that can validate the script's authenticity. For example, the URI may point to a location on a blockchain, or, URI may contain a hash digest of the resource, such as with IPFS. In the first situation, the client (wallet) should assume it is authentic. In the latter case, the client must also validate that hash digest.

2. If the `scriptURI` points to a dynamic location, the client must verify that the client script downloaded has actually been issued by the same entity that issued the token for which the client script is. The client must also warn the user against execution if this is not the case. However, this scenario is not covered by this ERC, but is handled by ERC 5XX1.

#### Overview

With the discussion above in mind, we outline the solution proposed by this ERC. For this purpose, we consider the following variables:

- `SCPrivKey`: The private signing key to administrate a smart contract implementing this ERC. Note that this doesn't have to be a new key especially added for this ERC. Most smart contracts made today already have an administration key to manage the tokens issued. It can be used to update the `scriptURI`.

- `newScriptURI`: an array of URIs for different ways to find the client script.

We can describe the life cycle of the `scriptURI` functionality:

- Issuance

1. The token issuer issues the tokens and a smart contract implementing this ERC, with the admin key for the smart contract being `SCPrivKey`.

2. The token issuer calls `setScriptURI` with the `scriptURI`.

- Update `scriptURI`

1. The token issuer stores the desired `script` at all the new URI locations and constructs a new `scriptURI` structure based on this. 
2. The token issuer calls `setScriptURI` with the new `scriptURI` structure.

### Specification

The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY” and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

We define a scriptURI element using the `string[]`.
Based on this, we define the smart contract interface below:
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
    function setScriptURI(string[] memory newScriptURI) external;
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

- Any user of the script learned from `scriptURI` MUST validate the script is either at an immutable location, its URI contains its hash digest, or it implements ERC 5XX1, which asserts authenticity using signatures instead of a digest.

### Rationale

This method avoids the need for building secure and certified centralized hosting and allows scripts to be hosted anywhere: IPFS, GitHub or cloud storage.

### Backwards Compatibility

This standard is compatible with all Token standards (ERC20, 721, 777, 1155 etc.)

### Examples

We here go through a couple of examples of where an authenticated script is relevant for adding additional functionality for tokens. 

1. A Utility NFT is an event ticket and the authenticated script is a JavaScript 'minidapp' which asks the user to sign a challenge message that shows ownership of the key controlling the ticket. The dapp would then render the signature as a QR code which can be scanned by a ticketing app, which could then mark the ticket as used.

2. Smart Token Labs uses a framework called TokenScript; one element of which is a user interface description for contract interaction.
Simple example: definition for a 'mint' function. This is a simple verb description similar to a JSON contract ABI definition; where the script gives the verb "Mint" and defines how the contract is called - in this case the contract function name 'mint' and attached value for mint fee. In use: for example a Punks v(x) owner wants to mint another punk, the owner can open their punks in wallet or on supported websites and there will be a 'Mint' verb on the token which when clicked will mint a new Punk without needing to reference the mintFee or connect a wallet etc.

3. A Smartlock controlling NFT script which defines an HTML view and two verbs "lock" and "unlock". Each verb has a JavaScript control script. When the token is selected, the HTML view would be displayed and an attached JavaScript would fetch a challenge string from the lock controller. When each verb is selected by the user in the hosting app or website, the relevant script attached to the verb would execute, prompting the user to sign the challenge then sending the challenge to the lock controller, which would reply with a pass or fail and execute an action accordingly. This is an off-chain example that uses on-chain assets for functionality.

### Test Cases
Test Contract
pragma solidity 0.8.10;
import "./IERC5XX0.sol";

... TODO

### Security Considerations

As `scriptURI` returns a list of free-form URIs, some forms of URI will not contain a digest. In such a case, it may be desirable to return the digest in a struct together with the URI. This allows the caller to assert the client script is authentic after downloading it.

However, Digital Signature is a much better way to solve this problem. With Digital Signature, the client script can be updated and resigned, without updating its hash in a smart contract.

Digital Signature is highly desirable because a token's client scripts are updated much more frequently than the token's smart contract.

We separately authored ERC5XX1 to guide the use of digital signatures.
