# The way we treat data on the blockchain is wrong; this works

Here in TokenScript project, we are adapting tried-and-true methods that have worked in cryptography engineering for decades to public blockchains.

Data on the blockchain is unfortunately not being used as it was designed for. People are blaming Ethereum blockchain congestion at the same time as they write smart contracts that forwards chit-chat messages. But having a blockchain strewn with graffiti isn't even the biggest problem.

The most prominent problem is that the data is not structured for interoperability, extensibility and longevity.

In other words, structures are invented for use only in one project, causing problems in other projects upon its changes, and get abandoned altogether soon after.

I'll start with an example data object, show how it could be treated differently, and finally introduce you to the work-in-progress TokenScript's data-object.

## Example of data objects

We will start with an example and generalise it later.

Imagine an event ticket as a data object, represented in the front-end developer's most favoured format, JSON:

    {
        "numero": 24,
        "class":  2,
        "start": "2020010120"
    }

It means:

 1. this is the *24th* ticket issued.
 2. in class *2*. Let's say cass 2 means a VIP-class ticket.
 3. the event starts by *2020-01-01 20:00*

Such a data object may be used in a blockchain transaction. Lets' say we have an Ethereum smart contract that transfers a ticket's ownership:

    function transfer_ticket(string ticket, address newOwner)

However, having the data object in JSON format will consume a lot of gas, as it increases the transaction size as well as the effort for the smart contract to parse it. It needs to be tightly packed. To do so, we need to first separate the data from its schema.

## Separation of data and schema

For the *data*, we DER-encode it into this 20 bytes: `0x3012020118020102180A32303230303130313230`. Watch how the 20 bytes contained the 3 pieces of data:

    0x30 12 02 01 18 0A 01 02 18 0A 32 30 32 30 30 31 30 31 32 30
                  --       --       +----------------------------
                  ^        ^                     ^
                  24       2         2  0  2  0  1  0  1  0  2  0

Observe the ticket number `24` encoded as `0x18`, the ticket class "VIP" encoded as `0x02` and the date encoded in an ASCII string. You can ignore the bytes between these data elements for now.

For the *schema*, we write it in ASN.X (an XML schema language)[^1].
    
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

The schema is stored in a TokenScript file, so wallets and dapp browsers can use that to understand the 20 bytes of data. The schema can be compiled into a terse piece of solidity byte code for the smart contract to parse the 20 bytes.

## Using the schema

Once we have separated the data from its schema, our Ethereum smart contract function becomes:

    function transfer_ticketing(bytes ticket, address newOwner)
    
Where `string` is replaced by `bytes` to accept the DER-encoded 20 bytes.

Let's take a closer look by showing a few lines before and after the function declaration:

    struct Ticket {
        uint nomero;  // the sequence number of the ticket
        uint class;   // 0: normal, 1: gifted, 2: VIP
        string start; // start time of the event
    }
    
    function transfer_ticketing(bytes ticket, address newOwner)
    {
        Ticket ticketObj = parse_ticket(ticket);
        ...
    }
    
Where the function `parse_ticket` consists of code compiled from the schema. It's much more efficient than a JSON parser, trust me.

In the meanwhile, should a similar DER-encoded bytes be constructed, for use in a transaction, or that the user's wallet need to display what's in a transaction that contains such bytes, it can use the schema to do so.

## So why the fuzz?

So what's the advantage of this DER or ASN fuzz over the following straightforward, newbie-friendly method?

    function transfer_ticket(uint numero, uint class, string start, address newOwner)
    
Or this more structured version?

    function transfer_ticket(Ticket ticket, address newOnwer)

Is it just for making the transactions shorter?

Well yes and more. At the outset, this cuts the transaction payload more than half. But you got more advantages.

First, DER-encoded data is useful for signing. So why do you need to sign it?

## Reason 1: Attestation

We call signed data objects "attestation" since it's the signer attesting to something.

Let's examine the ticket example again. At first, you might imagine that a ticket contract holds all the tickets and information about their ownership, so when Alice transfer a ticket to Bob, Alice sends a transaction reassign the ownership of that ticket to Bob.

In reality, an event organiser might issue tens of thousands of tickets, and most of the ticket owner will not transfer their ticket to someone else. If there isn't a transfer scenario, the ticket doesn't need to appear in the blockchain. The event organiser can sign an attestation, attesting the ownership of the ticket to a certain Ethereum key holder. The keyholder can prove his ownership by a challenge-response protocol.

So the first advantage of moving to DER encoded data is that it's easy to turn them into attestations. Starting from here we can cover more complicated scenarios like Merkle proof of attestation or even zero-knowledge proof of attestation. JSON isn't an ideal format for signed data since there are more than one ways to serialise a data object to JSON.

Attestation is very useful in general. For example, you can write a smart contract in such a way that a user who is attested to be a Sophisticated Investor can purchase in an ICO pre-sale. For another example, a car-insurance company can attest to the fact that your car (let's say represented by an Ethereum token) is insured.

More on how to sign a data object, therefore turning it into an attestation, can be found in TokenScript documents.

## Reason 2: Data-Interoperability

Second, it has better interoperability. Let's continue from the ticket attestation example. Which are the systems that need to use the attestation? We already know:

1. Smart contract. If Alice wishes to sell her ticket (in the form of an attestation), the smart contract needs to check the signature from the event organiser.
2. Wallet. It needs to understand what's in the attestation in order to display it correctly in a user's wallet, and, should any transaction involves it, let the user be aware of what's in the transaction. (Dapp browsers have the same need.)

But that's not all. The event organiser's website also needs to know how to read the attestation, since a ticket holder may use it to log in to a website to check the latest updates. The doorman (or their modern equivalent: a turnstile), naturally, needs to read this data, perhaps through a QR code).

Apparently, even the embassy and border police are the users of these attestations, since, in the last year, fully-attested FIFA tickets (called Fan ID) can be used to enter Russian border in place of a VISA.

Should there be any change of the data schema, let's say, the introduction of an additional ticket class called "VVIP", one can't expect all these decentralised systems to be updated together. However, if the data is schema-driven, one can update the schema and allow the relatively easy update.

You might think that if your token isn't supposed to be used among so many systems. One can never be sure. One of the major strength of decentralised platform like Ethereum, is the capacity for buidl. There are many systems which uses DAI were developed without authorisation of MakerDAO, the company. Such buidl wouldn't be possible with traditional centralised systems like American Express Connect.

## Reason 3: Extensibility

Extensibility is tightly connected to interoperability. Bear in mind, that once data is signed, you can't "convert it" for the consumption of a new system without invalidating its signature in the process. Thus, the systems must be built to understand both the old and new data, even if their schema has drifted in time.

Suppose you are the beneficiary of a will, which is in the form of crypto attestation. As your parents pass away, you are ready to cash it out. You certainly don't want the will contract - after many upgrades throughout the years your parents lived - not to accept it and ask it to be signed again by your parents in a new data structure.

One data structure that stood the test of time was X.509 certificates. It was invented before SSL, yet the underlying data structure survived until now. X.509 certificate is designed as an ASN.1 module, which has built-in support for extensibility.

So should today's blockchain data objects.

We will not have enough time to cover how this is done, but suffice to say, extensibility depends on schema. For example, a nicely defined schema allows you to do such magic like extending an array of data into a 2-dimensional matrix, should the need rise.

# Where are we going from here?

The token data object described in this article is a thread of work under TokenScript project. You may find a lot more about it in the:

(Waiting OASIS repository and mailin glist)

And participate through

(Waiting OASIS web pages of our project)

[^1]: The same schema can be written in a equivalent shorthand format called ASN.1:

     ````
         SEQUENCE {
           numero  INTEGER,
           class   ENUMERAGED { normal(0), gifted(1), vip(2) },
           date    UTCTime
         }
     ````
     We choose to use XML so we can extend it to allow encoding in ABI as well.
