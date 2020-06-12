ifeq ($(TOKENSCRIPT_SCHEMA),)
TOKENSCRIPT_SCHEMA=http://tokenscript.org/2020/06/tokenscript.xsd
endif

ifeq ($(XMLSECTOOL),)
XMLSECTOOL=xmlsectool
endif

ifeq ($(XMLLINT),)
XMLLINT=xmllint
endif

ifeq ($(XMLSEC),)
XMLSEC=xmlsec1 # xmlsec for Linux/Windows
endif


ifndef KEY
KEY=1
endif

SIGNATURE_ALGORITHM=rsa-sha256

help:
	# Needs a target, example: $$ make EntryToken.canonicalized.xml
	#
	# Let's say you have a TokenScript "EntryToken.xml"
	# - to validate and canonicalize, add 'canonicalized' in the filename
	@echo $$ make EntryToken.canonicalized.xml
	# - to sign, use tsml as file extension:
	@echo $$ make EntryToken.tsml

%.canonicalized.xml : %.xml
	# XML canonicalization and validation against TS schema
	$(XMLLINT) --c14n $^ > $@ && \
	 $(XMLLINT) --noout --schema $(TOKENSCRIPT_SCHEMA) $@ || \
	 (mv $@ $@.TEST && exit 1)

%.tsml: %.canonicalized.xml
ifeq (,$(KEYPASSWORD))
	$(error KEYPASSWORD is not set)
endif
ifeq (,$(KEYSTORE))
	@echo ---------------- Keystore missing. Try this ----------------
	@echo $$ make KEYSTORE=shong.wang.p12 KEYPASSWORD=shong.wang KEYINFO='"Shong Wang"' $@
	@echo replace it with your .p12 file and your password
	rm $^
else
	# Signing with xmlsec requires original .xml file to contain the Signature tag.
	# $(XMLSEC) sign --pkcs12:"$(KEYINFO)" $(KEYSTORE) --pwd "$(KEYPASSWORD)" --output $@ $^
	# For now use xmlsectool...
	$(XMLSECTOOL) --sign --keyInfoKeyName "$(KEYINFO)" --digest SHA-256 --signatureAlgorithm http://www.w3.org/2001/04/xmldsig-more#$(SIGNATURE_ALGORITHM) --inFile $^ --outFile $@ --keystore $(KEYSTORE) --keystoreType PKCS12 --key $(KEY) --keyPassword "$(KEYPASSWORD)" --signaturePosition LAST
	# removing the canonicalized created for validation
	rm $^
endif
