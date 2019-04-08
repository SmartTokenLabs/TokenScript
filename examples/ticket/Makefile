%.tsml: %.xml
	# XML Canonicalization
	xmlstarlet c14n $^  > $@.xml
	# XML Validation
	xmlstarlet val --xsd ../../schema/tokenscript.xsd $^
    # alternatively, use xmllint
    # xmllint --noout --schema ../../schema/tokenscript.xsd $@.xml
	mv $@.xml $@
ticket: AdmissionTicket.tsml 
