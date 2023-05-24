# Demonstrating verifying XML Digital Signature (xmldsig) #

xmldsig is used to sign every TokenScript file. This directory contains a
demonstration on how to verify xmldsig with JavaScript code.

## Prepare ##

First, make sure your nodejs is above version 15.0.0 where [WebCrypto was introduced](https://www.nearform.com/blog/implementing-the-web-cryptography-api-for-node-js-core/)

Then, install the dependencies in the `src` directory:

````
src$ npm install
````

Finally, also in `src`, apply an xmldom patch for [a known bug](https://github.com/xmldom/xmldom/issues/203). Note that this patch is destructive, the resulting xmldom won't work properly on html files (which we don't use in our case). Such a patch will not be needed (hence will be deleted from this repo) when xmldom release the next version after 0.5.0.

````
src$ patch -p0 < xmldom.patch
````

## Test ##

Let's say you have a bunch of signed TokenScripts residing in `../../../TokenScript-Repo/aw.app/2020/06/` (which you can get by checking out [TokenScript-Repo](https://github.com/AlphaWallet/TokenScript-Repo)). Run the files through the `xmldsigverifier.js` script:

````
src$ node xmldsigverifier.js ../../../TokenScript-Repo/aw.app/2020/06/*
[  OK  ] ../../../TokenScript-Repo/aw.app/2020/06/aDAI.tsml
[  OK  ] ../../../TokenScript-Repo/aw.app/2020/06/cBAT.tsml
…
[  OK  ] ../../../TokenScript-Repo/aw.app/2020/06/WETH.tsml
````

## Creating a webpack ##

Somehow webpack version >5 requires further configuration which hasn't been done, so make sure you use an earlier version of webpack, such as 4.44.2. Run `webpack` at this level, that is, not under `src` directory:


````
$ webpack
Hash: 5f6510c90828ac124c4f
Version: webpack 4.44.2
Time: 8110ms
Built at: 08/04/2021 11:31:47
  Asset     Size  Chunks                    Chunk Names
main.js  1.1 MiB       0  [emitted]  [big]  main
Entrypoint main [big] = main.js
````

The resulting file should be `dist/main.js`.

## Work in progress ##

- It currently fails with ECDSA signatures.

- Because this signature verifier doesn't check the certificates, the result is not an indication whether or not the TokenScript is signed with the correct key. More work needs to be done to use it in production environment.
