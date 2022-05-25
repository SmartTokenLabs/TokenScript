### eip: 5???
### title: Client Script extension for Token Contracts
### description: Add a scriptURI to point to point to an executable script associated with the functionality of the token.
### author: James (@JamesSmartCell), Weiwu (@weiwu-zhang), Tore Frederiksen (@jot2re)
### discussions-to:
### status: Draft
### type: Standards Track
### category: ERC
### created: 2022-05-03
### requires: 
### Abstract
This standard is an interface that adds a `scriptURI()` function for locating executable scripts associated with the token.

### Motivation
Often NFT authors want to provide some user functionality to their tokens, e.g. through scripts. This should be done safely, without opening the user to potential scams. By packaging a link to official scripts, created by the token minter, within the token itself, users can be sure they are using the correct script.

This ERC proposes adding a scriptURI which is a structure containing an array of URIs to external resources, such as in IPFS, GitHub, a cloud provider, etc.

Each scriptURI semantically contains access information to access a *single* signed script, stored in one or more off-chain locations.
Concretely each element in the array contains a pair of URIs, one to the script itself, and one to a signature of the script. 

The script provides a client-side executable to the hosting token. Examples of such script:

- A 'miniDapp', which is a cut-down dapp tailored for a single token
- A 'TokenScript' which provides [T.I.P.S.](https://tokenscript.org/TIPS.html) from a browser wallet.

To facilitate a future-proof solution, this ERC also proposes a solution which allows for updating such resources *after* the token has been issued.

To achieve this the token minter can use the signing key associated with the token minting and an associated smart contract, to authenticate a script/scriptURI signing key.

Similarly, the smart contract signing key can also be used to overwrite the scriptURI signing key, in case it gets compromised or needs to be rolled.
The scriptURI signing key is then used to authenticate the URI towards the smart contract, along with the script itself towards anyone accessing it.

#### Script location

While the simplest solutions to facilitate specific script usage associated with NFTs, is clearly to store such a script on the smart contract. However, this has several disadvantages: 
1. The smart contract signing key is needed to make updates. This means that this key becomes more exposed as it is used more often. 
2. Updates require smart contract interaction. Simply posting a new transaction on Ethereum is not cheap! When this transaction also includes smart contract logic, the price can quickly become significant. If frequent updates are needed, then smart contract calls can in itself becomes a hurdle.
3. Storage fee. If the script is large, contains special graphics or other large elements, then updates to the script can quickly costs thousands of dollars.

For these reasons it makes sense to store volatile data, such as token enhancing functionality, on an external resource. Such an external resource can be either centralized, such as a cloud provider or private server, or decentralized such as the interplanetary filesystem.
Since using centralized storage for a decentralized functionality goes against the ethos of web3, this ERC handle this this by allowing the token provider to store multiple URIs to the script on-chain. The URIs might point to either multiple centralized storage providers or fully decentralized ones, e.g. the IPFS, another blockchain or even on Ethereum itself. It could also be a mix of centralized and decentralized locations.

While this ERC does not dictate the format of the stored script, it should be noted that the script itself could contain pointers to multiple other scripts and data sources. Hence this allows for advanced and rich expansion of tokens.

#### Script updates
Besides issues of script location, another issue is how the script can be updated in a manner where the caller can be sure it is authentic. 
In this ERC we solve this issue by allowing the issuer to sign and update, on-chain, a scriptURI signing key which can be used to authenticate the script pointed to by the on-chain URI *without* requiring interaction with the smart contract. 
This approach has multiple advantages:
1. It allows for off-chain updates of the script (as long as the URI does not change), in a way that can be verified by anyone off-chain. 
2. It provides a key management functionality, where the smart contract signing key is not required to make updates to the script or its resources. This in turn, provides a key rolling mechanism and implicitly a revocation mechanism in case the script-signing key ever gets compromised. 

It is worth noting that if IPFS is used as URI, then updating the script will also result in an updated URI. This requires interaction with the smart contract. However, this can be done without requiring usage of the smart contract signing key, using a public interface method that allows anyone to update the URIs, but _only_ if they sign the parameters (i.e. new URIs) using the scriptURI signing key. 
This ensures that even if IPFS is used and URIs need to be updated every time the script is updates, we can still get the key management advantages of using a script signing key.

#### Overview

With the discussion above in mind we outline the solution proposed by the ERC. For this purpose we consider the following variables:
- `SCPrivKey`: The private signing key controlling a smart contract implementing this ERC, which is associated with the tokens issued. 
- `scriptPrivKey`: A private signing key which is used to sign the script issued by the smart contract owner/token provider along with the `scriptURI`.
- `scriptKeyAddr`: The address of the public key associated with `scriptPrivKey`, which is used to verify signatures signed with `scriptPrivKey`. 
- `script`: The script supplying additional functionality to the tokens.
- `sigScript`: The signature on `script` after signing it with `scriptPrivKey`.

With these variables in mind we can describe the life cycle of `scriptURI` functionality:
- Issuance
1. The token issuer issues the tokens and a smart contract implementing this ERC, with the controlling private key for the smart contract being `SCPrivKey`.
2. The token issuer samples a `scriptPrivKey` and associated `scriptKeyAddr`. They then sign `script`, to get a signature `sigScript` and stores both at one or more URIs, which are consolidated to a scriptURI.
3. The token issuer calls `setVerificationAddr(scriptKeyAddr)` on the smart contract to set the initial scriptURI signing key.
4. The token issuer signs the `scriptURI` with the signing key `scriptPrivKey`. Denote the signature `sigScriptURI`. 
4. The token issuer calls `setScriptURI` with the `scriptURI`, along with `sigScriptURI`.

- Update script
1. The token issuer signs a new script `script2` using `scriptPrivKey` to get a signature `sigScript2`. 
2. The token issuer updates `script` and `sigScript` at all its URI locations with `script2` and `sigScript2`.
3. Replace `script` with `script2` and `sigScript` with `sigScript2`.

- Update script signing key
1. The token issuer samples a new script signing key pair denoted `scriptPrivKey2` for the private part and `scriptKeyAddr2` for the public part.
2. The token issuer signs `script` using `scriptPrivKey2` to get `sigScript2` and then replaces `sigScript` with `sigScript2` at all its URI locations.
3. The token issuer calls `setVerificationAddr(scriptKeyAddr2)`.
4. Replace `scriptPrivKey` with `scriptPrivKey2`, `scriptKeyAddr` with `scriptKeyAddr2` and `sigScript` with `sigScript2`.

- Update script URI
1. The token issuer moves `script` and `sigScript` from their current URI locations to all new relevant URI locations, and based on this constructs a new `scriptURI` structure. 
2. The token issuer signs the new `scriptURI` structure with the signing key `scriptPrivKey`. Denote the signature `sigScriptURI2`.
3. The token issuer calls `setScriptURI` with the new `scriptURI` structure, along with `signScriptURI2`.
4. Replace `scriptPrivKey` with `scriptPrivKey2`.


### Specification
The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY” and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

We define a `scriptURI` element using the following structs:

```
struct scriptURI {
    scriptURIElement[] scriptURIElements;
}
struct scriptURIElement {
    string URIOfScript;
    string URIOfSignature;
}
```

Based on these elements we define the smart contract interface below:
```
interface IERC5XXX {
    /// @dev This event emits when the scriptURI is updated, 
    /// so wallets implementing this interface can update a cached script
    event ScriptUpdate(scriptURI memory newScriptURI);

    /// @dev This event emits when the script/scriptURI signing key is updated, 
    /// and hence must validate scripts using a new address.
    /// Wallets implementing this interface can update a cached script
    event verificationAddrUpdate(address memory newVerificationAddr);


    /// @notice Get the scriptURI for the contract
    /// @return The scriptURI
    function scriptURI() external view returns(scriptURI memory);
      
    /// @notice Get the public verification key address used to verify the signature of the script
    /// @return The verification address
    function verificationAddr() external view returns(address memory);


    /// @notice Update the scriptURI 
    /// emits event ScriptUpdate(scriptURI memory newScriptURI);
    function setScriptURI(scriptURI memory newScriptURI, bytes memory newSigScriptURI) external;

    /// @notice Set the script/scriptURI signing key
    /// emits event VerificationAddrUpdate(address memory newVerificationAddr);
    function setVerificationAddr(address memory newVerificationAddr)
}
```
The interface MUST be implemented under the following constraints:

- The smart contract implementing `IERC5XXX` MUST store variables `scriptURI currentScriptURI`, `address verificationAddr` and `address owner` in its state.

- The smart contract implementing `IERC5XXX` MUST set `owner=msg.sender` in its constructor.

- The ```ScriptUpdate``` event MUST be emitted when the ```setScriptURI``` function updates the `scriptURI`.

- The ```VerificationAddrUpdate``` event MUST be emitted when the ```setVerificationAddr``` function updates the signing key.

- The ```setVerificationAddr``` function MUST update the state `verificationAddr` to contain `newVerificationAddr` if and only if `owner == msg.sender`.

- The `setScriptURI` function MUST validate that `newSigScriptURI` contains a signature on `newScriptURI`, validated against `verificationAddr` stored in its state, *before* executing its logic and updating any state.

- The `setScriptURI` function MUST update its internal state such that `currentScriptURI = newScriptURI`.

- The `scriptURI()` function MUST return the `currentScriptURI` state.

- The ```scriptURI()``` function MAY be implemented as pure or view.

- Any user of the script learned from `scriptURI` MUST validate the script and its signature against `verificationAddr` before trusting it.


### Rationale
Using this method avoids the need for building secure and certified centralized hosting and allow scripts to be hosted anywhere: IPFS, GitHub or cloud storage.

### Backwards Compatibility
This standard is compatible with all Token standards (ERC20, 721, 777, 1155 etc).

### Examples
We here go through a couple of examples of where an authenticated script is relevant for adding additional functionality for tokens. 

1. A Utility NFT is a ticket and the authenticated script is a JavaScript 'minidapp' which asks the user to sign a challenge message that shows ownership of the key controlling the ticket. The dapp would then render the signature as a QR code which can be scanned by a ticketing app, which could then mark the ticket used (off-chain perhaps).

2. Smart Token Labs uses a framework called TokenScript; one element of which is a user interface description for contract interaction.
Simple example: definition for a 'mint' function. This is a simple verb description similar to a JSON contract ABI definition; where the script gives the verb "Mint" and defines how the contract is called - in this case the contract function name 'mint' and attached value for mint fee. In use: for example a Punks v(x) owner wants to mint another punk, the owner can open their punks in wallet or on supported websites and there will be a 'Mint' verb on the token which when clicked will mint a new Punk without needing to reference the mintFee or connect a wallet etc.

3. A smartlock controlling NFT script which defines an HTML view and two verbs "lock" and "unlock". Each verb has a JavaScript control script. When the token is selected, the HTML view would be displayed and an attached JavaScript would fetch a challenge string from the lock controller. When each verb is selected by the user in the hosting app or website, the relevant script attached to the verb would execute, prompting the user to sign the challenge then sending the challenge to the lock controller, which would reply with a pass or fail and execute an action accordingly. This is an off-chain example that uses on-chain assets for functionality.

### Test Cases
Test Contract
pragma solidity 0.8.10;
import "./IERC5XXX.sol";

... TODO


### Security Considerations
No security issues found.