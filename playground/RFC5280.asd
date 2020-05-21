<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<asnx:module xmlns:asnx="urn:ietf:params:xml:ns:asnx"
             name="PrivateKeyInfo">
    <sequence>
        <element name="version" type="Version"/>
        <element name="privateKeyAlgorithm" type="PrivateKeyAlgorithmIdentifier"/>
        <element name="privateKey" type="Privatekey"/>
        <optional>
            <element name="attributes">
                <type>
                    <tagged number="0" type="Attributes" tagging="implicit"/>
                </type>
            </element>
        </optional>
    </sequence>
    <namedType name="Version" type="asnx:INTEGER"/>
    <namedType name="PrivateKeyAlgorithmIdentifier" type="AlgorithmIdentifier"/>
    <namedType name="PrivateKey" type="asnx:OCTET-STRING"/>
    <namedType name="Attributes">
        <type>
            <setOf>
                <element type="attribute"/>
            </setOf>
        </type>
    </namedType>
    <namedType name="AlgorithmIdentifier">
        <type>
            <sequence>
                <element name="algorithm" type="asnx:OBJECT-IDENTIFIER"/>
                <optional>
                    <element name="parameters" type="asnx:OBJECT-IDENTIFIER"/>
                </optional>
            </sequence>
        </type>
    </namedType>
</asnx:module>