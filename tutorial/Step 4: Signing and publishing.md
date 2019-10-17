## Signing and publishing your TokenScript file

To publish your Tokenscript, it has to be signed.

Currently, a TokenScript is signed by an SSL key. For example, a TokenScript signed by the SSL key for the domain name shong.wang is displayed as "reputation relies on shong.wang" when rendered. To make your first signing easy, we provided both the signing key and needed SSL certificates.

** Dapps like DAI will have a signature from MakerDAO.com's SSL certificate; this gives the user peace of mind that the TokenScript is actually intended by the issuer. The file includes all the relevant code and therefore cannot be tampered with, as that would break the signature verification. ** 

### Install the tools

All XML signing tools should work, but we will we demonstrate here with xmlsectool.

First, check that you have the right tool installed. Say, in OS X with brew installed:

    $ brew install xmlsectool

If your package manager doesn't provide xmlsectool, you can download from its [home page](https://wiki.shibboleth.net/confluence/display/XSTJ2/xmlsectool+V2+Home) and install it manually.

From here I'll assume your system supports make. If not, it's easier to wait for the tutorial on how to sign with GUI, which we will produce based on [Oxygen's document](https://www.oxygenxml.com/doc/versions/21.0/ug-editor/topics/signing-files.html#signing-files) by late 2019.

If you installed xmlsectool manually, for example to `/opt/xmlsectool-2.0.0/`, you will need to change the first line of the MakeFile to this:

XMLSECTOOL=/opt/xmlsectool-2.0.0/xmlsectool.sh

Having that sorted out, please also install xmlstarlet and xmllint

    $ brew install xmlstarlet xmllint

Now we have all the tools ready.

### Validate the test TokenScript

Do a `make`. It will validate EntryToken.xml. It should pass if you haven't changed it.

    $ make EntryToken.canonicalized.xml
    # XML Canonicalization
    xmlstarlet c14n EntryToken.xml  > EntryToken.canonicalized.xml
    # XML Validation
	-xmlstarlet val --xsd http://tokenscript.org/2019/10/tokenscript/tokenscript.xsd $@ || (mv $@ $@.INVALID; xmllint --noout --schema http://tokenscript.org/2019/10/tokenscript/tokenscript.xsd $@.INVALID)

** If the file has errors, it will produce a file named EntryToken.canonicalized.xml.FAILED which you can use for debugging ** 

### Using your SSL key
To sign a TokenScript file you must retrieve the relevant SSL key that corresponds to the Token you are making a TokenScript for. e.g. `cdp.makerdao.com` for DAI related TokenScripts. 

This file must be converted to .p12 for signing and since most services will give you your file in .pem, here are the steps using OpenSSL to convert it from pem to p12. 

    $ openssl pkcs12 -export -out keystore.p12 -inkey pathToYourPrivateKey.pem -in pathToYourCert.pem -certfile pathToYourChain.pem

This command will ask for you to provide a password to encrypt the .p12, you will need to use this password again for the step below. The output of this command will be `keystore.p12`.

If you do not want to use your own key for this tutorial, simply skip this step and go to the next which uses the sample key `shong.wang`. 

### Sign the test TokenScript

We prepared the signing key and SSL certificates in ssl directory. If you use yours, remember to replace their references in the Makefile or use the command below with your encrypted .p12. 

Run `make` with `EntryToken.tsml`

    $ make EntryToken.tsml
    /opt/xmlsectool-2.0.0/xmlsectool.sh --sign --keyInfoKeyName 'Shong Wang' --digest SHA-256 --signatureAlgorithm http://www.w3.org/2001/04/xmldsig-more#rsa-sha256 --inFile EntryToken.canonicalized.xml --outFile EntryToken.tsml --key ssl/shong.wang.key --certificate ssl/shong.wang.certs
    INFO  XMLSecTool - Reading XML document from file 'EntryToken.canonicalized.xml'
    INFO  XMLSecTool - XML document parsed and is well-formed.
    INFO  XMLSecTool - XML document successfully signed
    INFO  XMLSecTool - XML document written to file /home/weiwu/IdeaProjects/TokenScript/examples/ticket/EntryToken.tsml
    # removing the canonicalized created for validation
    rm EntryToken.canonicalized.xml

And now you get a signed TokenScript EntryToken.tsml which is ready to be published. This file can also be dropped to the iOS or Android app as described in the previous step.

If you are signing with your own key from the step above, run: 

    $ make EntryToken.tsml KEYSTORE=keystore.p12 KEYPASSWORD=YourPassword

### Publishing your TokenScript

To test your current .tsml file, you can simply drop in onto your device with the instructions provided by step 3. As of now, we are serving signed tsml files from a server that the device can pull from to load into it's corresponding token card. 

If you would like to publish your own tsml file to run on this server, create a PR in this [repo](https://github.com/AlphaWallet/TokenScript-Repo) and we will review it. 
