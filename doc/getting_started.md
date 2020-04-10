# Getting Started

The best way to get started is to run through the [tutorial](https://github.com/AlphaWallet/TokenScript-Examples/tree/master/tutorial).

## Implicit Attributes

There are a few implicit attributes available:

* name
* symbol
* contractAddress
* ownerAddress
* tokenId

`tokenId` is especially useful for defining attributes with a function origin like this:

```
<ts:attribute-type id="locality" syntax="1.3.6.1.4.1.1466.115.121.1.15">
  <ts:origins>
    <ts:ethereum function="getLocality" contract="EntryToken" as="utf8">
        <ts:data>
          <ts:uint256 ref="tokenId"/>
        </ts:data>
    </ts:ethereum>
  </ts:origins>
</ts:attribute-type>
```

This is written with the assumption that the `getLocality()` smart contract function expects a single `uint256` argument representing the tokenId.

Here's another example with [ERC721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md)'s `ownerOf(uint256)`:

```
<ts:attribute-type id="owner" syntax="1.3.6.1.4.1.1466.115.121.1.15">
  <ts:origins>
    <ts:ethereum function="ownerOf" contract="MyToken" as="address">
        <ts:data>
          <ts:uint256 ref="tokenId"/>
        </ts:data>
    </ts:ethereum>
  </ts:origins>
</ts:attribute-type>
```
