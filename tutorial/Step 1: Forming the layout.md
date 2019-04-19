## Forming the layout in TokenScript

### Resources
All the files to complete this tutorial are contained in the example directory [here](https://github.com/AlphaWallet/TokenScript/examples). 

### Adding your layout
Since TokenScript is essentially an XML dialect, it is possible to plug in your existing layout files in HTML, CSS and JS. To begin, simply clone this repo and take a look at the token.en.shtml and enter.en.shtml files inside the example directory above. 

    $ git clone https://github.com/AlphaWallet/TokenScript && cd examples 

## View iconified and regular layout
In our wallet, you can render both an iconfied and regular view. The iconified view is shown
in the wallet token card and gives a summary of all the tokens you have within a contract.

It looks something like this: [<img src="https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/iconified-view.jpeg">](https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/iconified-view.jpeg)


The regular view is displayed after a user clicks on a particular token and it shows all the 
functions available to the user as well as a more indepth view of the token. It looks something like this: [<img src="https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/regular-view.jpeg">](https://github.com/AlphaWallet/TokenScript/blob/master/doc/img/regular-view.jpeg)



