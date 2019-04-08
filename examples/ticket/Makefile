%.tsml: %.xml
	# XML Canonicalization
	xmlstarlet c14n $^  > $@ 
	# XML Validation
    # if failed, run validation again with xmllint to get meaningful error
    # then delete the canonicalized file
	-xmlstarlet val --xsd ../../schema/tokenscript.xsd $^ || (xmllint --noout --schema ../../schema/tokenscript.xsd $@; rm $@)
ticket: AdmissionTicket.tsml 
