## Assembling the XML File

So, now that you have your token.en.shtml, enter.en.shtml and shared.css file, we are now ready to continue on to the XML file. This file will define the function calls, how we define the meaning of our tokens, off chain functionality of the token (in our example, it would be entering a building with a token via a challenge response) and plugging in the layout. 

Since NFTs can encode information inside their 32 bytes such as genes or what time the event is supposed to be held, we can use TokenScript to interpret the meaning of such tokens so that the user is given context. Furthermore, it is also possible to define logic which queries the smart contract for additional information, within the context of the token id itself. 

To inspect the example EntryToken.xml file we have for you, simply:

    $ cd examples/nft && cat EntryToken.xml

We have set up contracts on mainnet, ropsten, kovan & rinkeby that will always return a balance of two NFTs. You can use these to test against the sample TokenScript provided in the tutorial examples. 

### Creating your own XML file or editing ours 

You can make your own changes to the sample XML file in the examples directory and change it to match whatever you like. Once you drag and drop it in the next step, you will be able to see the changes reload and since there is a hardcoded balance of two NFTs, you will be able to play around with it. 