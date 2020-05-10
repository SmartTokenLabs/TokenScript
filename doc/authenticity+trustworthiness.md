## Authenticity and trustworthiness of a TokenScript

(This document is not about the runtime security of Token Enclave - which will be documented separately. This deals with the authenticity and trustworthiness of a TokenScript on a textual level.)

A TokenScript file can be signed. A TokenScript can also be trusted. Ideally, both should be done.

At the moment, TokenScript is trusted through an "Express-of-Trust" transaction from the smart contract deployment key. In the future, a smart contract might be able to return the signing key needed for TokenScript. Both should work towards asserting the relationship between a Smart Contract and a TokenScript, hence establishing trust.

However, trust coming from smart contract alone isn't sufficient to the end user, since the user has otherwise no way to assert if the smart contract is the one he intends to interact with, or a phishing contract. But when that trust is not available, having the TokenScript signed helps the end-user to ascribe trust by authenticity.

- If a TokenScript is trusted, through an Express-of-Trust transaction, then the Smart Contract owner has either created or read the TokenScript and recommended the end-users to use it.

- If a TokenScript is signed, the end-user can ascribe authenticity (the author and integrity), and if that author is known to the end-user, he is likely to trust it without the Express-of-Trust; otherwise, he makes his own decision.

Or in other words:

- signing a TokenScript establish authenticity of the TokenScript but not how much the token contract trusts it;

- the express-of-trust transaction expresses that the token contract author trusts the TokenScript, but nothing about authenticity (who wrote it).

Or in layman's terms:

- Signing a TokenScript "connects" it to identity (e.g. a website, an organisation), with no guarantee if that identity is of a trustworthy entity.
- Express-of-trust claims the  TokenScript trustworthy, without connecting it to any identity.

Both have their uses. If you are a token contract author, you can do express-of-trust to a TokenScript; however, there are cases that signed TokenScripts are needed:

Case 1:

A token issuer (custodian) want to reassure a user who trusts it by an external (non-blockchain) identity (e.g. website domain name) that he/she is using the correct contract. For example, a token issuer changed its main contract after discovering some security exploitation. It knows that its user trust it by domain name, so it might issue a token script that is signed by the same domain name with expressed trust from both the old and new contract to help the user to migrate.

Case 2:

A token issuer discarded his deployment key (or lost it), but still wish to let its user trust the TokenScript they provided by the help of providing authenticity (revealing the authorship).

Case 3:

A token issuer did not write a TokenScript, but a 3rd party did it; or that the 3rd party has provided additional features. If the 3rd party gained trust (e.g. through social media or within a community), it can sign and release its own TokenScript, and the users can accept them by the reputation of the 3rd part without the token contract's Express-of-Trust.

(The cases of "mixed configuration", like when a 3rd party writes a TokenScript providing action in addition to the one written by the token issuer, is not covered in this introductory document. Instead, they are covered in the future modularisation documents.)

## Signed

A signed TokenScript file is a TokenScript file signed through the use of an XML Signature. Any signature signing algorithm supported by XML Signature (including ECDSA supported through XML Signature 1.1) is accepted.

At this moment, user agents should only accept such XML Signatures if certified by a certificate authority (CA). For convenience, a website certificate will do at this moment. In the years to come, implementations might require certificates from issuers who can validate an organisation or various forms of decentralised certificate issuers.

When a signed TokenScript is used, the user agent displays the domain name or organisation name of the certificate. It's up to the user if they allow the use of such a TokenScript. We expect users to assert judgement based on whether or not they recognise the CommonName of the certificate.

Revocation follows the same principles as these certificates normally do.

### Signing of external data

Any data reference - icons, images and language packs - used by the TokenScript must be referred to in the `<SignedInfo>` section of the XML signature using `<Reference>` element, or they will be considered not available (TokenScript implementations decide how to treat unavailable data). Each reference is downloaded and its digest verified as part of the TokenScript signature verification process. If any of the references fail to download or the digest doesn't match, the entire XML signature is bad. 

## Trusted (Ethereum)

A trusted TokenScript file is one explicitly trusted by the author of a token contract on Ethereum. Such trust is expressed by an Ethereum transaction. Only one signing algorithm, ECDSA (secp256k1), is used in express-of-trust because trust is expressed by an Ethereum transaction.

Such trust is also revoked by a transaction.

The transaction consists of a simple To address, with no data attached.

### The "from" address

If the smart contract has no key-management on its own, the transaction should be sent from the smart contracts deployment key. If the smart contract has a key management function, the transaction should be sent from the current administrative key.

### The "to" address

- to express trust, send any amount (e.g. 0Ξ) to a special address that represents the trust from the token contract (𝑡) to the TokenScript.

- to express revocation, send any amount (e.g. 0Ξ) to another special address that represents the revocation of such trust.

The express-of-trust special address is calculated in this way:

TokenScript project's donation address is: `0x000bd52fb4f46f148b0ff0cc651048e283d2d000`. Its public key is *Y*, its value is:

    0x483d69cc4377d318da81402f2488f588ccae3d22a37be36457a574487d9ca4d9c38cd62d83113e440c7bdc682ced6d05ee739b831c6d5cb01982367f76fc8ce0

In multiplicative group notation, its value is 𝑔ˣ where 𝑥 is the private key held by TokenScript administration.

First, we obtain a SHA256 digest 𝑑 from the exclusive canonicalization of the TokenScript. If this TokenScript happens to be signed as well, and the `<DigestMethod>` used for its root is SHA256 (it usually is), you can find the value encoded in base64 in the `<DigestValue>` if it is signed. (Of course, you need to calculate this value if the TokenScript isn't signed.)

Then compute *h=H(𝑡|"TRUST"|𝑑)* where *H* denotes Keccak. `|` is used to denote concatenation. The text *TRUST* is simply an ASCII encoding of the literal word TRUST.

Then, we generate the secp256k1 elliptic curve point Yʰ, and hash it to get an address. This is the special address for express-of-trust of this specific TokenScript.

This address can be independently generated by TokenScript implementations, without the knowledge of 𝑥. Hence trust can be verified independently. In the meanwhile, if an implementation has the TokenScript file, it can calculate the private key of that address by 𝑥·ℎ given that (𝑔ˣ)ʰ = (gʰ)ˣ.

For revocation, the idea is the same, except the point used for the special address is now *h=H(𝑡|"REVOKE"|s)*. 

## difference between trusted and signed

### Symantec: signing express authorship, not trust

A signed TokenScript is no more trustworthy than the signer identified by CommonName. It has no cryptographically provable tie to the token itself. For example, we know by reputation that MakerDAO has the stewardship of the DAI token, so a TokenScript for DAI Token signed by MakerDAO.com is probably trustworthy.

In other words, whether or not a signed TokenScript is trustworthy is the judgement of the user.

Express-of-trust is stronger and more direct. The key holder which deployed (or manages) the DAI token contract explicitly expressed trust to that TokenScript by sending a transaction. It's time locked in a blockchain.

It's worth noticing that Express-of-trust isn't authorship - a smart contract author can express trust to a signed TokenScript authored by someone else. While signed a TokenScript implies authorship. 

### Signing isn't on the file; trust is

A signed TokenScript is signed by an XML signature which usually is (but not required to) be embedded in an XML file. The cryptographic signature is not in the file; it's in the `<SignedInfo>` element of the XML Signature. The XML signature is not in the file either, it's on a collection of references which typically contains the root node of the TokenScript.

### Signing doesn't use Keccak at all; express of trust only uses Keccak

Keccak isn't defined as a valid hashing method in XMLSIG11, so it can't be used in an XML Signature without extending the w3 recommendation behind it, which leads to trouble when validating with existing tools. Therefore we restrict the signing of TokenScript to the algorithms allowed in XMLSIG11.

For the same reason, since developers might be habitually using Keccak in blockchain applications, we use Keccak to hash the TokenScript as well as the express-of-trust.

