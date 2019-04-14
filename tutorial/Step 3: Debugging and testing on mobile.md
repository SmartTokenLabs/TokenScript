## Debugging and testing on iOS and Android

So you now have your TokenScript XML and shtml file defined, excellent!
Now you are ready to test it out on AlphaWallet.

### Get AlphaWallet iOS or Android
[<img src=https://github.com/AlphaWallet/alpha-wallet-ios/blob/master/resources/app-store-badge.png height="88">](https://itunes.apple.com/us/app/alphawallet/id1358230430?ls=1&mt=8) [<img src=https://github.com/AlphaWallet/alpha-wallet-android/blob/master/dmz/src/main/resources/static/images/googleplay.png height="88">](https://play.google.com/store/apps/details?id=io.stormbird.wallet&hl=en_US)

### Clone the source
Go to either [iOS](https://github.com/AlphaWallet/alpha-wallet-ios) or [Android](https://github.com/AlphaWallet/alpha-wallet-android) source repo

### Make the file
If you want to simply drop the completed file in (minus the signature), open up the Makefile in examples and 
change it to match your own files. If your XML schema is valid, it will produce a .tsml file which you can use directly for debugging.  

### Debugging on iOS 
After cloning the source code you can run it with either the emulator or your own phone via xcode or AppCode.
If you are using the emulator, simply copy the path it prints when loading up in xcode and cd into it. 
Once there you shoud see a directory called 'assetDefinitions', simply drop the file into this directory.

If you are using your real device, simply airdrop the .tsml or .shtml, .css and .xml files. 
** Make sure you name the file with the contract address followed by the extension **. 

### Debugging on Android
Like with iOS, you can either use your own device or the emulator.
To use the emulator, simply run the GitHub project via Android Studio and run it. 
You can drag and drop the file in the app_data/AlphaWallet directory. 

