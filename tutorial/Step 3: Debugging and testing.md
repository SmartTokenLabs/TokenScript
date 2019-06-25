## Debugging and testing on iOS and Android
So you now have your completed .xml and .shtml files, excellent! You can now merge the files together and drop them for testing in AlphaWallet iOS and Android. To merge the files together run 'make EntryToken.canonicalized.xml' which will validate the files and put them all together. Since we have hardcoded the balances for this contract, you will be able to see them immediately in your wallet after you add them by clicking the + button on the homescreen and entering the contract address '0x63cCEF733a093E5Bd773b41C96D3eCE361464942' or your choice of testnet (see EntryToken.xml for all the addresses available). 

** We have uploaded this example file to our repo server, this means you do not have to drag and drop it to the device unless you are planning to edit it or create your own ** 

### Get AlphaWallet iOS or Android
[<img src=https://github.com/AlphaWallet/alpha-wallet-ios/blob/master/resources/app-store-badge.png height="88">](https://itunes.apple.com/us/app/alphawallet/id1358230430?ls=1&mt=8) [<img src=https://github.com/AlphaWallet/alpha-wallet-android/blob/master/dmz/src/main/resources/static/images/googleplay.png height="88">](https://play.google.com/store/apps/details?id=io.stormbird.wallet&hl=en_US)

### Clone the source
Go to either [iOS](https://github.com/AlphaWallet/alpha-wallet-ios) or [Android](https://github.com/AlphaWallet/alpha-wallet-android) source repo

### Debugging on iOS 
After cloning the source code you can run it with either the emulator or your own phone via xcode or AppCode. If you are using the emulator, simply copy the path it prints when loading up in xcode and cd into it. Once there you shoud see a directory called 'assetDefinitionsOverrides', simply drop the file into this directory.

If you are using your real device, simply airdrop the canonicalized.xml file or drop the xml file with its three layout files (shared.css, enter.en.shtml & token.en.shtml). 

### Debugging on Android
As with iOS you can either use your own device or the emulator. Run on Android Studio/Intellij and use your device or the emulator. In the AlphaWallet settings choose 'enable dev override', allow the app access to file structure then drag and drop the file into the AlphaWallet directory at root or upload to sdcard/AlphaWallet using the Device File Explorer. If the 'enable dev override' is not chosen inside the app, it will not be able to pick up files in this directory.

