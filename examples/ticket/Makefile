%.tsml: %.xml
	# XML Canonicalization
	xmlstarlet c14n $^  > $@.xml
	# Validating -- might take a long time to download xsd files from w3.org
    # weiwu: xmlstarlet can do validation too, but always outputs nothing for me
    # xmlstarlet val --xsd ../../schema/tokenscript.xsd $^
	xmllint --noout --schema ../../schema/tokenscript.xsd $@.xml
	mv $@.xml $@
ticket: AdmissionTicket.tsml 
