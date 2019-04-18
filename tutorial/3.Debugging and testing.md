## Debugging and testing on iOS and Android

So you now have your completed .xml and .shtml files, excellent! You are now ready to drag and drop it into AlphaWallet for testing with your actual token. If you are using the FIFA WC example, it would be best that you copy the source code [here](https://github.com/AlphaWallet/contracts/blob/master/blockchain-tickets/schema1/TicketingContract.sol) so that you can have a balance of tokens to test with.   

### Get AlphaWallet iOS or Android
[<img src=https://github.com/AlphaWallet/alpha-wallet-ios/blob/master/resources/app-store-badge.png height="88">](https://itunes.apple.com/us/app/alphawallet/id1358230430?ls=1&mt=8) [<img src=https://github.com/AlphaWallet/alpha-wallet-android/blob/master/dmz/src/main/resources/static/images/googleplay.png height="88">](https://play.google.com/store/apps/details?id=io.stormbird.wallet&hl=en_US)

### Clone the source
Go to either [iOS](https://github.com/AlphaWallet/alpha-wallet-ios) or [Android](https://github.com/AlphaWallet/alpha-wallet-android) source repo

### Debugging on iOS 
After cloning the source code you can run it with either the emulator or your own phone via xcode or AppCode. If you are using the emulator, simply copy the path it prints when loading up in xcode and cd into it. Once there you shoud see a directory called 'assetDefinitions', simply drop the file into this directory.

If you are using your real device, simply airdrop the .tsml or .shtml, .css and .xml files. 

### Debugging on Android
As with iOS you can either use your own device or the emulator. Run on Android Studio/Intellij and use your device or the emulator. In the AlphaWallet settings choose 'enable dev override', allow the app access to file structure then drag and drop the file into the AlphaWallet directory at root or upload to sdcard/AlphaWallet using the Device File Explorer. If the 'enable dev override' is not chosen the app will not be able to pick up files in this directory.

