### eip: 5???

### title: asserting authenticity of Client Script for Token Contracts

### description: Provide a method to assert the authenticity of client script for token contracts, and a way for revokation

### author: Weiwu (@weiwu-zhang), Tore Frederiksen (@jot2re)

### discussions-to:

### status: Draft

### type: Standards Track

### category: ERC

### created: 2s022-05-03

### requires: 

### Abstract

This ERC describes how to assert the authenticity of signed client-script and adds a `revokeClientCodeSigningKey()` function for revocation.

### Motivation

Often NFT authors want to provide some user functionality to their tokens through client scripts. This should be done safely, without opening the user to potential scams. By signing such code with a *Script Signing Key* linked to the creation of the smart contract. Refer to ERC xxxx examples of such scripts.

Although ERC xxxx specified a way to obtain a set of client scripts through URI, in many cases, it is

- insufficient; for example, a smart contract might has script for different environment or use-cases. Take a subway token as an example, it might invoke a minimal script to drive the purchase and use of subway tokens in order to send them through NFC (Internet might be slow or inaccessible underground)
- inapplicable; for example for token contracts that was issued before the creation of ERC xxxx

This ERC offers a way to assert authenticity of such client scripts disregarding how it is obtained, and can work with smart contracts prior to the publication of this ERC.

### Overview

Although the *smart contract author* and the *client script author* can be the same person/team, we will assume they are different people in this ERC, and the case that they are the same person/team can be implied.

Step 1. The *script author* creates a *script signing key*.

Step 2. The *smart contract author*, using the *smart contract deployment key*, signs a certificate whose subject is the code signing key, which includes expiry.

Step 3. Any client script is to be shipped signed by the *script signing key* and with a certificate attached.

This process is a deliberate copy of the TLS certificate, which is based on x.509 and was proven working in the past decades.

The authenticity of the client script may be obtained through `scriptURI()` function call as in ERCxxxx, or maybe supplied separately by the use-cases, but this ERC is applicable to any code that is signed, and a client must validate the signature in the way specified in this ERC. In real life use-cases, the client scripts can be either supplied by aforementioned `scriptURI()` or offered to the client (wallet) in anyway the wallet can work with, even through NFC connections or QR code.

### Format of the certificate and signature

[expand here] certificate is to be in x.509 format. the signature is to be compatible with XMLDSIG.

### Format to attach signature

This ERC does not specify how a wallet client obtains the signature [examples of ways to obtain]

### Concerning Proxy Contract



