# API

## Intro

### Who provides the API

TokenScript supporting user-agent (Dapp browser), wallet or self-supporting Dapps themselves provides JavaScript API.

### For whom to use

- The JavaScript running in TokenScript
- Javascript running in Dapp websites.

Both uses the same JavaScript API but with nuances. For example:

---

Difference in the tokens available to be accessed through this API.

- The tokens available to a Dapp website depends on what token the user has chosen to use on that Dapp, as well as the tokens not owned by the current user, like the token the Dapp offers to transfer to the user (e.g. auction Dapp website) or to be created for the user (e.g. purchasing a new tokenised FIFA Ticket).

- The tokens available to the Javascript in a TokenScript is typically the current token itself and dependencies. In the TokenView, may also include other tokens that can interact with the current token.

---

The API has 2 parts

A. The token data.

B. The callback when the token data changes.

## A. Token Data

---
The shape of the data is:

```
web3.tokens = [
    all: [
        token,
        token,
        ...
    ],
    definition: {
        "0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3": tokenDefinition,
        "0xf018225735f70a1961B6B8aa07B005e6392072E7": tokenDefinition,
        ...
    },
    dataChanged: function(oldTokens, updatedTokens, tokenCardId)
]
```

For a fungible token, like airline point, the token variable is like this:

```
token = {
    contractAddress: "0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3",
    balance: 98.66250478,
    available: 96.6625047,
    locked: {"state-channel-0934": 2},
    votingRights: 73.929672,
    transferrable: 54.6625047,
    expiry: {"2018-09-03": 34, "2018-18-04": 10, "never": 54.6625047},
}
```

Where attributes like `votingRights` are defined in TokenScript.

For a non-fungible token, like a ticket to an event:

```
token = {
    contractAddress: "0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3",
    instances: [
        instance,
        instance,
        ...
    ]
}

instance = {
    _count: 1,
    contractAddress: "0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3",
    numero: 11,                               # sequence of the ticket
    section: "22",
    building: "Some building",
    street: "Some street",
    country: "SG",
    ...
}

tokenDefinition = {
    attributeType: {
        attributeId: attribute,
        category: {
            name: "Cat",
	    syntax: "Integer",
	    single: "true",
        },
        startTime: {
            name: "Event Start Time",
	    syntax: "BinaryTime",
        },
        ...
    },
    grouping: {...},
    ordering: {...},
    symbol: "TICKET",
    name: "Ticket Token"
},

attribute = {
    name: "Cat",
    value: "TEST"
}

```

The metadata of a token is available in `web3.tokens.definition` with the contract address in [EIP55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md) as the key. The metadata is basically a 1:1 map from the relevant parts of the asset definition. Only the localized attribute names (and not grouping, ordering) is available for now.

`attributeType` contains type information of each attribute, e.g. its name, syntax or whether the attribute type is single-valued. For example, to access the localized attribute name `"countryA"` for the token with contract `"0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3"` use:

```
web3.tokens.definition["0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3"].attributeType["countryA"]["name"]
```

All attribute types are in the `attributeType` dictionary, even for attributes that are not used in any of the token (for fungible) or tokenInstance (for non-fungible). For example, a user might have a few EventTicket tokens, none of them have `category` attribute because the event doesn't categorise tickets, but `category` can be found in `attributeType` dictionary because it's typed. This is needed in many cases, e.g. when TokenScript is going to create a new ticket with `category` attribute.

The other elements in a `tokenDefinition`, like `name` and `symbol`, refer to the name and symbol of the token.

*Only* `web3.tokens.dataChanged` (and not `web3.tokens.all` nor `definition`) is available in AlphaWallet's Android and iOS build at the moment.

### Attribute-Value Pair? Not always

In the previous example, observe that not every attribute of a token is of a primitive type.


```
token = {
    contractAddress: "0xD8e5F58DE3933E1E35f9c65eb72cb188674624F3",
    balance: 98.66250478,
    available: 96.6625047,
    locked: {"state-channel-0934": 2},
    votingRights: 73.929672,
    transferrable: 54.6625047,
    expiry: {"2018-09-03": 34, "2018-18-04": 10, "never": 54.6625047},
}
```

There are two attributes that are not of a primitive type: `locked`, which represents the balance committed somehow (typically, to a state channel), and `expiry` which is how much the balance will disappear at certain date, typically used as an incentive for users to spend, the opposite incentive of Bitcoin.

What form of value do we have for each attribute is a result of the attribute-type found in `tokenDefinition`.

Take time as an example. Typically, blockchain uses `BinaryTime` syntax for gas efficiency, which is just binary encoded UnixTime. When used as the time of an event, there is no ambiguity which point of time it refers to, no matter in which timezone the event happens. In such case, the attribute is a dictionary of a single key:

```
instance = {
    section: "22",
    startTime: {
        date: new Date("1985-11-07T02:06:27")
    }
    ...
}
```

Date object is represented by the code with which it would have been created. The key is `date` to inherit the misnaming by JavaScript.

However, in the case the time relevant to the timezone is important, the token designer would have supplied a [GeneralizedTime](https://en.wikipedia.org/wiki/GeneralizedTime). Take a FIFA football match ticket as an example, `matchTime` attribute is a dictionary of two keys: `date` as a Date object, not containing timezone, and the raw value for GeneralizedTime which has the timezone in it.

```
instance = {
    section: "22",
    matchTime: {
        generalizedTime: "19851106210627-0500",
        date: new Date("1985-11-07T02:06:27")
    }
    ...
}
```

If a developer intends to find out if an attribute is of `BinaryTime` or `GeneralizedTime`, he can look up the definition (search for `BinaryTime` in the beginning of this document for an example).

The value of `matchTime.date` would be a normal `Date` object, the time the match starts. As every `Date` object, it doesn't contain the timezone information. But if you want to display a venue-specific time, eg. a soccer game match time at the venue, you need to extract that information from the `generalizedTime` string, like shown in the [example](../examples/ticket/js/generalized-time-test.html).

## B. Callback

TokenScript's JavaScript API is designed to be asynchronous.

---

There are 3 args supplied to the `web3.tokens.dataChanged` callback:

* old data — this contains the data — token instance and card attribute values — before the change
* updated data — this contains the data — token instance and card attribute values — after the change
* tokenCardId — the CSS ID of the wrapper `<div>` to place content in

Developers can use this callback and the arguments to figure out what has changed. We might point them to a good JSON-diff library; but since the purpose here is just to render a static layout, they can just re-render the whole DOM as we do in our examples.

A simple way to implement that would be:

```
web3.tokens.dataChanged = (old, updated, tokenCardId) => {
    const data = updated
    document.getElementById(tokenCardId).getElementsByClassName("contents")[0].innerHTML = new Token(data).render()
}
```

TokenScript will automatically generate a `<div>` with a unique ID (`tokenCardId`) and wrap the TokenScript view with it. This wrapper `<div>` will have the CSS class `".token-card` so it can be styled (if desired).

The snippet assumes the presence of a `<div>` that has the class name `contents`. Adding this `<div>` makes it easier to access/replace the contents. Note that developers should *not* do this as the wrapper `<div>` generated by TokenScript wraps around HTML, CSS and JavaScript provided by the TokenScript view:

```
document.getElementById(tokenCardId).innerHTML = replacementDomHtml
```

The above-mentioned `Token.render()` function generates a DOM from a dictionary of token attributes.

Within the `Token` class, the token data can be access like this:

```
const tokenAttributeValue = this.props.token.tokenAttribute1
```

and the card data like this:

```
const cardAttributeValue = this.props.card.tokenAttribute1
```

And if we are sure the token and card attribute names don't clash, we can pretend they are in the same namespace with:

```
web3.tokens.dataChanged = (old, updated, tokenCardId) => {
    const data = Object.assign({}, updated.token, updated.card)
    document.getElementById(tokenCardId).getElementsByClassName("contents")[0].innerHTML = new Token(data).render()
}
```

Then this is unchanged:

```
const attributeValue = this.props.tokenAttribute1 //or this.props.cardAttribute1
```

Future
---
In (A), we can also stuff the entire list of tokens in the user's Ethereum wallet in there (in a future iteration) under the `all` key. We might have to key them by wallet/networks too. Performance is a concern, but this simple approach has quite a number of advantages. Perhaps it can be partially mitigated by adding a permission call that TokenScript developers have to make to make `tokens` accessible, maybe as part of the permission granted via https://eips.ethereum.org/EIPS/eip-1102 (which we should implement anyway) or a new function call.

The development and debugging experience is a little tedious. With access to the simulator, we can drop updated files and run a web inspector on the simulator's TokenScript webview to look at the console.log output. Without the app's source, we can AirDrop TokenScript files to the app. The developer experience is something we need to look into a bit more.

Implementing the TokenScript API and Rendering in the TokenScript Clients
