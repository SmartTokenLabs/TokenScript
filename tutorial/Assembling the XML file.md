## Assembling the XML File

So, now that you have your token.en.shtml file, we are now ready to continue on to the XML file 
which will define the function calls, how we define the meaning of our tokens, 
off chain functionality of the token (in our example, it would be things 
like selling the token and redeeming the token) and plugging in the layout. 

Since NFTs like cryptokitties and our example can encode information inside their 32 bytes such 
as genes or what time the game is supposed to be held, we can use TokenScript to interpret 
the meaning of such tokens so that the user is given context.  

### Creating your own XML file

You can create your own XML file by simply copying the one below and filling it out to match your own requirements. If you would like to simply try this one as an example then simply copy and paste it into a .xml file. This file will later be referenced in step 4 for signing and formation of the .tsml file. 

If you would like a sample xml file for your own testing, copy and paste the file [here](https://github.com/AlphaWallet/contracts/blob/master/blockchain-tickets/schema1/TicketingContract.xml)