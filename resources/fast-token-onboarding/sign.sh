#!/bin/bash
NAME='YOUR COMPANY NAME'
KEYSTORE_FILE=./YOUR_KEY_FILE.p12 # of your domain
# set .p12 password in last line of xmlsectool command below

TOKEN_FILE=USDx.xml # or erc721.canonicalized.xml
SIGNATURE_ALGORITHM=rsa-sha256 # or ecdsa-sha256

echo "Signing xml with $KEYSTORE_FILE..."
xmlsectool --sign --keyInfoKeyName "$NAME" --digest SHA-256 \
  --signatureAlgorithm http://www.w3.org/2001/04/xmldsig-more#$SIGNATURE_ALGORITHM \
  --inFile $TOKEN_FILE --outFile "$NAME".tsml --keystore $KEYSTORE_FILE --keystoreType PKCS12 \
  --key 1 --keyPassword "YOUR .P12 PASSWORD" --signaturePosition LAST
