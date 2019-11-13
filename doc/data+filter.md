# Data-objects and Tokens

This article serves to tell the difference between a token (defined with a `<token>` element) and data-objects (defined with a `<data>` element). I will start by giving examples and end with a definition.

Imagine a token with these attributes:

    {
     "objectClass": "CarToken",
     "ownerAddress": "0xdecafbad",
     "colour": "red",
     "rego": "4JHLC",
     "VIN": "KL3TA48E9EB541191"
    }

It might be associated with a few types of objects, the owner of the car, lends it to Bob for 3 days, Alice will create an authorisation, which is an artifact with properties:

    {
     "objectClass": "AuthorisationToUse",
     "car": "rego=4JHLC",
     "user": "Bob",
     "start": 2019-09-09,
     "end": 2019-09-10,
     "allow": ["drive", "refuel", "service", "park", "locate"],
     "deny": ["collateralise", "sell", "trade", "lease"],
     "issuer": 0x809384902...80957FF # this is an Operational property derived from the signature
    }

Let's move to a more advanced scenario of objects derived from the original CarToken. Let's say Alice collateralises it to get a loan, a *CollateralisedDebtObligation* token would be created:

    {
    "objectClass": "CollateralisedDebtObligation",
    "collateralType": "CarToken",
    "collateral": "VIN=KL3TA48E9EB541191",
    "value": 35,
    "CreateTimeStamp": 2019-09-09,
    "maturity": 2020-09-09
    }

The two cases (authorisation and *CollateralisedDebtObligation* token) look alike, but this time the new thing is called a token, not an data-object. There are 2 reasons.

First, authorisation is an artifact depending on the *CarToken*. It doesn't have to affect the status of the *CarToken*. For example, on Alice's mobile phone, the authorisations can be displayed below the car token in a list. Alice can authorise her entire family to use the car with several authorisations or a multi-user authorisation.

On the other hand, *CollateralisedDebtObligation*, also depending on the *CarToken*, affects the status of the *CarToken*, since a collateralised car can't be collateralised again, nor can it be sold (without changing the loan). On Alice's mobile phone, the car might be displayed with a "collateralised" tag, together with a *CollateralisedDebtObligation* token to remind her of the payment obligation and allow her to do things like withdrawing from its line of credit. One can imagine that in this case the car token is extended to include its collateralisation. Since json doesn't support namespace, I'll use a comment to denote the extended attribute:

    {
     "objectClass": "CarToken",
     "ownerAddress": "0xdecafbad",
     "colour": "red",
     "rego": "4JHLC"
     "VIN": "KL3TA48E9EB541191",
     "collateralised": TRUE # look up CollateralisedDebtObligation token contract
    }

Therefore it can be used to affect the available actions of a *CarToken*, since the condition for "trade" action might be:

    !(collateralised=TRUE)

The second difference is that AuthorisationToUse has no actions. For example, it can't be traded. When the user Bob has an authorisation, he didn't see *authorisation* token next to the car token, but just the CarToken, with its permitted actions listed. If Alice sends Bob a second authorisation, maybe because the first is expiring, Bob doesn't see two distinct *AuthorisationToken* each with a *CarToken* in it; instead, Bob sees just one Token, with expiry extended.

An authorisation would be a token, if it represents a lease. This is the case when the authorisation is obtained through a transaction, that is, Bob paid to obtain a lease of the car. The lease might even be transferrable.

But not every object derived from a CarToken can be a token. Transfer of ownership, for example, is an event. An event is an artifact too:

    {
    "owner": 0xdecafbad,
    "newOnwer": 0xbaddecaf,
    "EventBlockId": 1234546, # this is an Operational Attribute, not declared in the event's ABI
    "EventTransactionId", 0x83480327027503...03082FF # also an Operational Attribute
    }

Even if the Transfer of ownership event has a 1-to-1 relationship with another token, e.g. *StampDuty* token, and that the event's properties coincide with the attributes of that token, the event is still an artifact and the StampDuty still a token, not the same thing. The event data-object only exists in the scope of the token, while the *StampDuty* token has its own scope. (It also does not *have to* inherit the event's properties). This relationship is similar to how a SalesOffer data-object, which has price information, from the view of blockchain, has a 1-to-1 relationship with the SalesContract token, which is created by the buyer sending a transaction with SalesOffer data-object as payload, and every *SalesOffer* data-object property becomes a *SalesContract* token attribute, they are still two different thing.

Conclusion:
![Venn Diagram of Artifacts and Tokens](img/token_data.svg)

# Filters

Filters are used to selecting data-objects and tokens. In the above examples, we used filters a few times:

    rego=4JHLC

    VIN=KL3TA48E9EB541191

    !(collateralised=TRUE)

Unlike structured query language like SQL, a filter does not specify what to do when the filtering is done. For example, when an attribute sources data from an event origin:

    <ts:attribute-type id="name" syntax="1.3.6.1.4.1.1466.115.121.1.15">
      <ts:origins>
        <ts:ethereum event="NameRegistered" filter="label=${tokenID}" value="name"/>
      </ts:origins>
    </ts:attribute-type>

- the filter `label=${tokenID}` selects data-objects. In this case, only one is expected to be sifted through.
- should there be more than one, name will be a multi-valued (ordered) attribute, like `allowed` shown before.
- find the specified property, in this case `name`, whose value is used for the value of the attribute.

As you can see, in TokneScript, a filter can be used on events (to filter events), or it can be used as the condition for actions. Or, it can be used as values of properties, in which case it either expresses a search or specifies which token an data-object (signed message or event) is about. By today's NFT convention, you can imagine something like this

    tokenID=0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f

being the most frequently used filter when it is used as a property (e.g. when someone floats an order to sell a kitty by tokenID).

## filtering multi-value attributes

In TokenScript filter we do not distinguish between the two forms of multi-value expressions (observe the last property):

    {
     "objectClass": "AuthorisationToUse",
     "car": "rego=4JHLC",
     "user": "Bob",
     "start": 2019-09-09,
     "end": 2019-09-10,
     "allow": ["drive", "refuel", "service", "park", "locate"]
    }

and

    {
     "objectClass": "AuthorisationToUse",
     "car": "rego=4JHLC",
     "user": "Bob",
     "start": 2019-09-09,
     "end": 2019-09-10,
     "allow": "drive",
     "allow": "refuel",
     "allow": "service",
     "allow": "park",
     "allow": "locate"
    }

For example, this filter matches the data-object:

    allowedAction=drive

The following filter also matches the data-object:

    (&(allowedAction=drive)(allowedAction=refuel))

The distinction between a set and an ordered list is incomprehensible to millennium developers and potentially create issues with signed data. Recognising that, multi-valued attributes are always ordered-multi-valued attributes.

Notice that filters use Polish notation to be parsed into abstract syntax tree with less gas. When data-objects are in the payload, the smart contract has to go through them with either pre-compiled filter or take the filter from another data-object or token attribute value.
