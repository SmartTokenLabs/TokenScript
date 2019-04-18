## Forming the layout in TokenScript

### Resources
We will be using this file [here](https://github.com/AlphaWallet/contracts/blob/master/blockchain-tickets/schema1/fifa-wc.tsml)
as an example and you can find others in our other repository [here](https://github.com/AlphaWallet/contracts). 

### Adding your layout
Since TokenScript is essentially an XML dialect, it is possible to plug in your existing layout files in HTML, CSS and JS. 

### Getting your hands dirty with our FIFA WC NFT token in TokenScript
To get started, simply create (or copy and paste) the layout formed below with the file name token.en.shtml

To get your hands on a sample file which you can copy and paste, click [here](https://github.com/AlphaWallet/TokenScript/blob/master/examples/ticket/token.en.shtml)

This code enables you to render the token we are about to create and defines all the appropriate logic such as the styling, images(in base64) and how to render other details related to your token. 

## View iconified and regular layout
In our wallet, you can render both an iconfied and regular view. The iconified view is shown
in the wallet token card and gives a summary of all the tokens you have within a contract.

It looks something like this: [<img src="https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/iconfied-view.jpeg">](https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/iconfied-view.jpeg)


The regular view is displayed after a user clicks on a particular token and it shows all the 
functions available to the user as well as a more indepth view of the token. It looks something like this: [<img src="https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/regular-view.jpeg">](https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/regular-view.jpeg)



