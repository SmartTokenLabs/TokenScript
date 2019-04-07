%.tsml: %.xml
	# XML Canonicalization
	xmlstarlet c14n $^  > $@.xml
	# Validating -- might take a long time to download xsd files from w3.org
	# If you see an error 'http://www.3.org...: parser error', read the comments in Makefile
    # it's because w3.org's web server failed to serve you the needed xsd.
    # run it again or switch network and run it again. It might be w3's anti-ddos gateway
	xmllint --noout --schema ../../schema/tokenscript.xsd $@.xml
    # weiwu: xmlstarlet can do validation too, but always outputs nothing for me
    # xmlstarlet val --xsd ../../schema/tokenscript.xsd $^
	mv $@.xml $@
ticket: AdmissionTicket.tsml 
