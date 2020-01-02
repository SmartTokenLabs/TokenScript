# The way we treat data on the blockchain is wrong—this is how it’s supposed to work (pt1)

Here in the TokenScript project, we are adapting tried-and-true methods (that have borne fruit in cryptography engineering for decades) to public blockchains.

Unfortunately, data on the blockchain is not being used for its intended purpose. People are blaming Ethereum “congestion” while writing smart contracts that forward chit-chat messages. But having a blockchain strewn with "crypto-graffiti" isn’t even the biggest problem.

The biggest problem, in our view, is that the data simply is not structured for interoperability, extensibility and longevity.

In other words, the data’s structure is tailored for use in only one token project —— this specificity tends to cause problems in other projects that uses the token. Many data structures are abandoned as changes are introduced, and messages already signed can't be used.

I’ll start with an example data object, illustrate how it could be treated differently, then introduce you to the TokenScript’s data-object (which is a work in progress).

## Example of data objects

We’ll start with an example, which we’ll later generalise.

Imagine an event ticket as a data object, encoded in JSON:

![JSON representation of a ticket data object](data-object-ticket.svg)

This object, a ticket, carries the following information:

1. This is the 24th ticket issued.
2. The ticket is “class 2” (analogous to a VIP-class ticket).
3. The event commences on January 1, 2020 at 20:00.

Such a data object may be used in a blockchain transaction. Suppose say we have an Ethereum smart contract that transfers a ticket’s ownership:

    function transfer_ticket(string ticket, address newOwner)

Having the data object in JSON format will consume a lot of “gas,” however, because it increases the transaction size and the required effort for smart contract parsing. The data object needs to be tightly packed, and to make that happen, we must first separate the data from its schema.

## Separation of data and schema

For the *data*, we encode it into this 20 bytes: 0x3012020118020102180A32303230303130313230. Observe how the 20 bytes contained the 3 pieces of information:

    0x30 12 02 01 18 0A 01 02 18 0A 32 30 32 30 30 31 30 31 32 30
                  --       --       +----------------------------
                  ^        ^                     ^
                  24       2         2  0  2  0  1  0  1  0  2  0

Observe the ticket number `24` is encoded as `0x18`; the ticket class "VIP" encoded as `0x02`; the date is encoded in an ASCII string. The in-between structural-bytes are the result of using standard DER encoding rules†.

For the *schema*, we write it in ASN.X (an XML schema language).
    
    <sequence>
        <element name="numero" type="asn:Integer"/>
        <element name="class">
            <type><enumerated>
                <enumeration name="normal" number="0"/>
                <enumeration name="gifted" number="1"/>
                <enumeration name="VIP"    number="2"/>
            </enumerated></type>
        </element>
        <element name="start" type="asn:UTCTime"/>
    </sequence>
    
Schema has to be stored outside of the smart contract. In our TokenScript project the schema is stored in TokenScript so that wallets and dapp browsers compatible with TokenScript can use the schema to understand the 20 bytes of data. You can store it in other formats‡ but you shouldn’t store it directly in a smart contract, instead, the schema can be *compiled* into a terse piece of solidity bytecode for the smart contract to parse the 20 bytes.[^2]

## Using the schema

Once we have separated the data from its schema, our Ethereum smart contract function becomes:

    function transferTicketing(bytes ticket, address newOwner)
    
Where `string` is replaced by `bytes` to accept the DER-encoded 20 bytes.

Let's take a closer look by showing a few lines before and after the function declaration:

    struct Ticket {
        uint numero;  // the sequence number of the ticket
        uint class;   // 0: normal, 1: gifted, 2: VIP
        string start; // start time of the event
    }
    
    function transferTicketing(bytes ticket, address newOwner)
    {
        Ticket ticketObj = parse_ticket(ticket);
        ...
    }
    
The function `parse_ticket` consists of code compiled from the schema. This is considerably more efficient than a JSON parser.

On the other hand, should a dapp need to construct such DER-encoded bytes for use in a transaction, or should the user’s wallet need to display an already-constructed transaction in a user-readable way, it can rely on the schema.

## Why the fuzz?

So what's the advantage of this DER or ASN fuzz over the following straightforward, newbie-friendly method?

    function transferTicket(uint numero, uint class, string start, address newOwner)
    
Or this more structured version?

    function transferTicket(Ticket ticket, address newOnwer)

Is it just for making the transactions shorter?

The answer to both these questions is “yes,” and there’s more to that “yes” than one may assume. At the outset, this decreases transaction payload by more than 50%, albeit with more advantages:


## Reason 1: Attestation

A string of DER-encoded bytes is useful for signing. Why do you need to sign it, though?

To get an attestation. We call signed data objects "attestation," since it's the signer attesting to something.

Let's examine the ticket example again. At first, you might imagine that a ticket contract holds all tickets and information regarding their ownership. For example, when "Alice" transfers a ticket to "Bob," Alice initiates a transaction which reassigns the ownership of that ticket to Bob.

An event organiser might issue thousands, if not tens of thousands of tickets for an event, and most of the people who receive the issued tickets will not then transfer them to someone else. If there isn't a transfer scenario, the ticket need not appear in the blockchain. The event organiser can sign an attestation, where they attest the ticket's ownership to a certain Ethereum key holder. The keyholder can prove their ownership via a challenge-response protocol.

On the other hand, if data is encoded in JSON, it can’t be signed safely since JSON is not a deterministic encoding.

Attestation is generally useful. Here are a few examples.

- You can write a smart contract in such a way that a user attested to be a Sophisticated Investor can make purchases in an ICO pre-sale.

- A car insurance company can attest to the fact that your car (represented here by an Ethereum token) is insured.

- If your car is a smart vehicle and you authorises a friend to drive it, you can write an attestation without sending an Ethereum transaction.

The schema for signing of attestations should be adapted from existing standards, rather than inventing new ones and recreate security issues already solved in existing standards. TokenScript is [working on such an schema adaptation](https://community.tokenscript.org/t/weekly-design-meeting-16-simple-attestation-format/302). There are much further work to be done. For example, we need a format that can do partial attestation by using Merkle Tree, or even zero-knowledge proof of attestation.

## Reason 2: Data-Interoperability

DER-encoded data has better interoperability. Continuing with the ticket attestation example: which systems need to use the attestation? We already know about the following.

1. **Smart contracts**. If Alice wishes to sell her ticket (in the form of an attestation), the smart contract needs to check the event organiser’s signature.

2. **Wallets**. The attestation’s contents must be properly understood for a correct display in a user’s wallet. Should any transaction involve the attestation, it will inform the user of what’s in the transaction. (Dapp browsers have the same need.)

That’s not all. The event organiser’s website also needs to know how to read the attestation, since a ticket holder may use it to log in to a website to check for updates. The doorman (or a turnstile, their modern equivalent) needs to read this data (perhaps through a QR code).

Even the Embassy and border police use these attestations—throughout the last year, fully-attested FIFA tickets (called Fan ID) were used to cross the Russian border in lieu of a VISA.

It’s not difficult to recognize that there are many systems interested in attestations, and these systems are heterogeneous. For example, a smart contract belongs to blockchain, and a Wallet belongs to mobile app. When it comes to the event organiser’s website, JSON representation may be needed. The turnstile at the gate is an IoT system which accepts QR codes. Since on the system depends on a verified signature, it can’t be converted it at will —— a uniformed presentation of the signed data would be necessary in that circumstance.

Should there be any alteration of the data schema (such as, for instance, the introduction of an additional ticket class called “VVIP”), one can’t reasonably expect all these decentralised systems to be updated together. If the data is schema-driven, however, the schema can be updated to facilitate a relatively easy update.

You may think your token ought not to be used across so many systems. The reality is: one can never be sure. One of the major strengths of decentralised platform like Ethereum is the capacity for buidl. There are more than a few systems which uses DAI were developed without MakerDAO’s authorisation. Such buidl wouldn’t be possible with traditional centralised systems like American Express Connect.

## Reason 3: Extensibility

Extensibility is tightly connected to interoperability. Always bear in mind that once data is signed, it can’t be “converted” for the consumption of a new system without invalidating its signature in the process. Thus, the systems must be built to understand old and new data alike (even if their schema has drifted in time).

Suppose you are the beneficiary of a will that is in the form of crypto attestation. Once your parents pass away, you are ready to cash it out. You certainly don’t want the will contract, after undergoing a variety of upgrades throughout the years your parents lived, to reject the attestation and ask that it be signed again by your (now deceased) parents within a new data structure!

One data structure that stood the test of time is X.509 certificates. It was invented before SSL, and its underlying data structure survived until now. X.509 certificate is designed as an ASN.1 module, which has built-in support for extensibility.

Today’s blockchain data objects should also boast this support.
There isn’t enough time to cover how this is done, but to summarize, extensibility depends on schema. For instance, a nicely defined schema enables one to perform tasks such as extending an array of data into a 2-dimensional matrix as required.

# Where are we going from here?

Here in TokenScript project we treat data correctly by adapting existing standards. TokenScript itself is designed to be standardized and is being mentored by OASIS (the same standard group behind Open Document ISO standards). To participate you can join:

- [TokenScript Forum](http://community.tokenscript.org/)
- Participate [the design meeting on Google Hangout Meet](https://meet.google.com/yix-kjmv-gsj) every Thursday 7pm Sydney time
- If you live near Melbourne, Australia, participate [the meet-up on 22th Nov](https://meet.google.com/yix-kjmv-gsj)
- Browse the [TokenScript project website](http://tokenscript.org) and the github repository (linked from that website).

[^1]: DER is the default way to encode data in cryptography engineering. For example, Bitcoin signatures and X.509 certificates are encoded this way. If you want to inspect DER encodeded data, you can use openssl like this:

    $ echo -n 0x3012020118020102180A32303230303130313230 | xxd -r -p | openssl asn1parse -inform DER -i
    0:d=0  hl=2 l=  18 cons: SEQUENCE          
    2:d=1  hl=2 l=   1 prim:  INTEGER           :18
    5:d=1  hl=2 l=   1 prim:  INTEGER           :02
    8:d=1  hl=2 l=  10 prim:  GENERALIZEDTIME   :2020010120

[^2]: The same schema can be written in a equivalent shorthand format called ASN.1:

     ````
         SEQUENCE {
           numero  INTEGER,
           class   ENUMERATED { normal(0), gifted(1), vip(2) },
           date    UTCTime
         }
     ````
     We choose to use XML so we can extend it to allow encoding in ABI as well.
     
# The way we treat data on the blockchain is wrong—this is how it’s supposed to work (pt2)

In my last article I made the following points;

- Data on the blockchain should be extensible with a schema that can be signed;
- Data itself should be tight and signed.
- 