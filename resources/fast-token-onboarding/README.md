# AlphaWallet
Verifying your tokens for TokenScript, and thus recognition in AlphaWallet.

# xmlsectool - xml signing tool
Signing of xml requires xmlsectool:
- Mac: brew install xmlsectool
- Linux/Windows: https://wiki.shibboleth.net/confluence/display/XSTJ2/xmlsectool+V2+Home#xmlsectoolV2Home-ObtainingandUsingxmlsectool

# TokenScript
Open the relevant erc20 or erc721 canonicalized.xml file, and modify the parameters accordingly:
- Name as it will appear to users (eg CryptoKitty / CryptoKitties):
  - `<ts:string quantity="one">Singular Name</ts:string>`
  - `<ts:string quantity="other">Plural Name</ts:string>`
- Token Name (eg CryptoKitties): `<ts:contract interface="erc721" name="YOUR_ERC721_TOKEN_NAME">`
- Smart Contract address: `<ts:address network="1">0xYOUR_CONTRACT_ADDRESS_HERE</ts:address>`
- Contract Name (eg CryptoKitties): `<ts:ethereum contract="YOUR_ERC721_TOKEN_NAME"> <!-- as above ts:contract name -->`

# Signing
A script has been provided for convenience (sign.sh), please open and modify parameters accordingly:
- `NAME='YOUR COMPANY NAME'`
- `KEYSTORE_FILE=./YOUR_KEY_FILE.p12 # of your domain`
- `TOKEN_FILE=erc20.canonicalized.xml # or erc721.canonicalized.xml`
- keyPassword `"YOUR .P12 PASSWORD"`

# Testing your .tsml
Command: `curl -X POST -F file=@"/full/path/YOUR_TSML_FILE.tsml" https://aw.app/api/v1/verifyXMLDSig`
Success: `{"result":"pass", ...}`

# You're in!
Please send the resulting .tsml file (signed/certified xml), or get in touch if you have any questions/comments.

We look forward to sharing your token with our users!
The AlphaWallet Team
