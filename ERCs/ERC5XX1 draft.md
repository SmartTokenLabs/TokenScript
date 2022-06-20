### eip: 5???

### title: asserting authenticity of Client Script for Token Contracts

### description: Provide a method to assert the authenticity of client script for token contracts, and a way for revocation

### author: Weiwu (@weiwu-zhang), Tore Frederiksen (@jot2re)

### discussions-to:

### status: Draft

### type: Standards Track

### category: ERC

### created: 2022-05-03

### requires: 

### Abstract

This ERC describes how to assert the authenticity of the script related to some token or smart contract, regardless of how the script was obtained.

### Motivation

Often NFT authors want to provide some user functionality to their tokens through client scripts. This should be done safely, without opening the user to potential scams. Refer to ERC 5169 examples of such scripts.

Although ERC 5169 specified a way to obtain a set of client scripts through URI, it is inapplicable for token contracts that was issued before the creation of ERC 5169. 
However, crucially ERC 5169 only considers *how* a user might retrieve a single script from one or more (possibly centralized) end-points. It does not consider how the user can validate that *what* is retrieved from these end points are actually authentic and has not been modified by the entity storing the content. 

ERC 5169 also does not show how handle the situation where the NFT might have multiple *different* scripts associated. This can for example be the case if the NFT supports localization. Thus it does not make sense to download and load all language translations and localized functionalities.

This ERC offers a way to assert authenticity of *any* client scripts disregarding how it is obtained, and can work with smart contracts *prior* to the publication of this ERC. It does so using idea of general certificate management and chains of trust, as is done for the ubiquitous [X.509 certificates](https://datatracker.ietf.org/doc/html/rfc5280). 


### Overview

Although the *token/smart contract author* and the *client script author* can be the same person/team, we will assume they are different people in this ERC, and the case that they are the same person/team can be implied.

The steps needed to ensure script authenticity can be summarized as follows:

1. The *script author* creates a *script signing key*, which has an associates *verification key address*.

2. The *smart contract author*, using the *smart contract deployment key*, signs a certificate, including expiry info and whose subject public key info contains the *script signing key's* associated *verification key*.

3. Any client script which is deployed gets signed by the *script signing key* and with a certificate attached.

This process is a deliberate copy of the TLS certification, based on X.509, which has stood the test of time. 

The authenticity of the client script may be obtained through the `scriptURI()` function call, as in ERC 5169, or supplied separately by the use-cases. However, this ERC is applicable to any code or data that is signed, and a client must validate the signature in the way specified in this ERC. In real life use-cases, the client scripts can be either supplied by aforementioned `scriptURI()` or offered to the client (wallet) in anyway the wallet can work with, even through NFC connections or QR code.

### Implementation

Below we offer some possible methods of implementation. Although we note that we cannot deliver a completely off-line solution unless a hosting app can pre-verify the *smart contract deployment key* address. 

Assuming internet connection and the smart contract is written *with* this ERC in mind, then the simplest approach involves linking to the JWS object outlined below (containing the script itself, URI to certificate, signature of the script signed by *script signing key*) via `scriptURI()` in the contract. This consists of the following steps: 
1. Determine *smart contract deployment key*. Contract should preferably implement standard `Ownable` interface or at least the `owner()` function.
2. Fetch the JWS object by querying the `scriptURI()` in the contract.
3. Fetch the certificate linked to from the JWS in the `x5u` header.
4. Validate that certificate is signed by the *smart contract deployment key*.
5. Obtain the address of the *script signing key* from the `SubjectPublicKeyInfo` field of the certificate.
6. Obtain the script itself; in our example it will be bundled in the JWS object itself, along with the signature attached to the script, in the `<ds:SignatureValue>` tag.
7. Verify that the signature from the `<ds:SignatureValue>` tag is the correct signature of the Keccak-hashed script by the *script signing key*.
8. Current time is within `notBefore` and `notAfter`.
9. If the *script signing key* is still valid according to the certificate *and* the script has been signed correctly by the same key, allow user to interact with the token contract(s) defined in the script via the script interface.

If instead the contract is *without* considering this ERC, then simplest approach is as follows: 
1. The user obtains an URI for the relevant JWS object (for example by scanning an NFC beacon on their mobile phone). 
2. The JWS Object is fetched along with the script pointed to from the JWS object.
3. The origin contract is determined from script.
4. Obtain the owner of the script by querying `owner()`. Alternatively the JWS object can provide the contract creation transaction, so the user can validate and obtain *smart contract deployment key* address from this.
5. Continue from step 3 in the description above (the flow of a smart contract written *with* this ERC in mind), but skipping step 6, as we already have the script.
6. Finally, if the *script signing key* is still valid according to the certificate *and* the script has been signed correctly by the same key, allow user to interact with the token contract(s) defined in the script via the script interface.

### Specification
The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY” and “OPTIONAL” in this document are to be interpreted as described in [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

#### Format of the certificate and signature

The certificate for the *script signing key* MUST be in the X.509 format, in accordance with [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280).
Furthermore, the certificate MUST by signed by the *smart contract author* as the issuer, using the *smart contract deployment key*.

We furthermore make the following requirements of the content of this certificate:

- The `issuer` field MUST be populated with a Common Name, which MUST be the address of the verification key associated with the *smart contract deployment key*. E.g. `CN=0x12345678901234567890`.

- The `SubjectPublicKeyInfo` field MUST contain the public part of the *script signing key*.

- The `extensions` field SHOULD be set to include `KeyUsage` (see RFC 5280 sec. 4.2.1.3) with bit 0 set, to indicate that the *script signing key* is used for signing only. Furthermore the *Extended Key Usage* extensions SHOULD also be included, with only the *id-kp-codeSigning* identifier set (See RFC 52080 sec. 4.2.1.12).

- If [revocation option 1](#Revocation) is used, then `extensions` MUST also include `cRLDistributionPoints` (see RFC 5280 4.2.1.13) which MUST contain at least one `distributionPoint` element, containing a `fullName` element. The `fullName` MUST be a single `IA5String` for a `uniformResourceIdentifier` which is an URI pointing to a Certificate Revocation List.

- The `notBefore` and `notAfter` field SHOULD be set to limit lifetime of the *script signing key* reasonably.

- The `version` field SHOULD be grater than 2, to indicate that the certificate is **not** a regular X.509 certificate.

- If the signing key is a secp256k1 key, then the `signatureAlgorithm` element **must** use OID `1.2.840.10045.2.1` for its `algorithm` field.

We require the signature to be done as a JWS according to [RFC 7515](https://datatracker.ietf.org/doc/html/rfc7515). Concretely we have the following requirements to the elements contained in the JWS:

- The `x5u` header MUST be included and stored as part of the `JWS Protected Header`. Furthermore, its URI MUST point to the X.509 certificate of the *script signing key*.

- The `payload` member MUST be exactly the URL base64 encoding of the client script *or* an a Keccak of the client script.


#### Format to attach signature

This ERC does not specify how a wallet client obtains the signature as this can be realized in multiple ways. The simplest of which is to embed the client script in the `payload` of the JWS, as discussed above. This ensure that only a single URI is needed in order to locate both the client script, its signature and the signing key certificate. 

If the client script is stored in a directory (e.g. on a webserver), i.e. with a file-name instead of with a hash digest identifier, then the JWS can simply be stored using the same URI as the client script, with ".jws" or ".sig" appended.


#### Revocation

While the X.509 certificate SHOULD be issued with a limited life-time, key leaks can still happen, and thus it should be possible to revoke an already issued X.509 certificate. 

This ERC does not dictate how or if it should be done. But it is required that the `notBefore` and `notAfter` fields in the X.509 certificate are significantly constrained if the no revocation mechanism is used.

We furthermore define 2 OPTIONAL revocation mechanisms:

1. Using Certificate Revocation Lists (CRL). The *smart contract author* published a signed list of revoked certificates at one or more URIs. If this option is used, then the X.509 certificate MUST contain information of how to access the CRL, as already discussed. This ERC does not dictate the format of the CRL but recommend keeping it as simple as possible. For example letting it be a JWS, signed with the *smart contract deployment key* where the `payload` isa URL base64 encoding of a comma-separated list of (hex) Keccak hash digests of each revoked X.509 certificate. In this example, the signature of the CRL SHOULD be validated against the address of the *smart contract deployment key* which issued the X.509 certificate, when checking for revocation. Furthermore, when checking the revocation list it MUST be verified that the Keccak Hash digest of the X.509 certificate is not included in the CRL.

2. Storing a list of revoked verification key addresses in the smart Contract. A smart contract `function revokeVerificationAddr(address memory revokedVerificationAddr)` could be added to the token smart contract, which MUST append `revokedVerificationAddr` to a list, which can then be returned through a `function revokedVerificationAddrs() external view returns(address[] memory)`. In this case, the address of the `SubjectPublicKeyInfo` in the X.509 certificate MUST be validated to **not** be in the list of returned `revokedVerificationAddrs`.


#### Validation

When it comes to validating the authenticity of client script, the following steps MUST be completed. If any of these steps fails, then the script MUST be rejected:

1. The client script, JWS and X.509 and the address of the *smart contract deployment key* MUST be fetched. Note that if the client script is embedded as the `payload `of the JWS, then an URI of the JWS uniquely defines how to learn both the signature (embedded in the JWS), the client script (embedded in the JWS), and the X.509 certificate (through the URI in the `x5u` header). 

2. The JWS signature is validated according to RFC 7515, using the public key contained in the `SubjectPublicKeyInfo` field of the X.509 certificate.

3. If the `payload` of the JWS does **not** contain the script, then it MUST be validated that the `payload` is the Keccak hash digest of the client script fetched.

4. The X.509 certificate is validated according to RFC 5280, with the exception that a value of `version` SHOULD be accepted if and only if it is greater than 2, and that the public key used to sign it is recovered from the signature itself. Furthermore, the recovered public key MUST be checked to represent the same address as stored in the Common Name in the `issuer` field.

5. The address stored in the Common Name of the `issuer` field in the X.509 certificate is validated to be equal to the address of the *smart contract deployment key* .

6. If the client script/JWS is pointed to by a `scriptURI` in accordance to ERC 5XX0, then it SHOULD also be validated that the URI of the client script/JWS is contained in the array returned by the smart contract method `scriptURI()`.

7. If a [revocation mechanism](#Revocation) is used, then it should validated that the X.509 certificate has not been revoked.

### Concerning Proxy Contracts

The usage of a *script signing key* can prevent the need of a proxy contract to allow for script updates. However, if a proxy contract is already in use, then this ERC can work by simply requiring the *script signing key* certificate to be signed by the proxied contract. 

