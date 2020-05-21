<?xml version="1.0"?>
<asnx:module xmlns:asnx="urn:ietf:params:xml:ns:asnx"
             name="RFC5280"
             tagDefault="explicit">

 <namedType name="PrivateKeyInfo">
  <type>
   <sequence>
    <element name="version" type="Version"/>
    <element name="privateKeyAlgorithm"
             type="PrivateKeyAlgorithmIdentifier"/>
    <element name="privateKey" type="PrivateKey"/>
    <optional>
     <element name="attributes">
      <type>
       <tagged number="0" tagging="implicit" type="Attributes"/>
      </type>
     </element>
    </optional>
   </sequence>
  </type>
 </namedType>

 <namedType name="Version" type="asnx:INTEGER"/>

 <namedType name="PrivateKeyAlgorithmIdentifier"
            type="AlgorithmIdentifier"/>

 <namedType name="PrivateKey" type="asnx:OCTET-STRING"/>

 <namedType name="Attributes">
  <type>
   <setOf>
    <element name="item" identifier="" type="Attribute"/>
   </setOf>
  </type>
 </namedType>

 <namedType name="Attribute">
  <type>
   <sequence>
    <element name="type">
     <type>
      <fromClass class="ATTRIBUTE" fieldName="id"/>
     </type>
    </element>
    <element name="values">
     <type>
      <setOf>
       <element name="item" identifier="">
        <type>
         <fromClass class="ATTRIBUTE" fieldName="Type"/>
        </type>
       </element>
      </setOf>
     </type>
    </element>
   </sequence>
  </type>
 </namedType>

 <namedClass name="ATTRIBUTE">
  <class>
   <typeField name="Type"/>
   <valueField name="id" unique="true"
               type="asnx:OBJECT-IDENTIFIER"/>
  </class>
 </namedClass>

 <namedType name="AlgorithmIdentifier">
  <type>
   <sequence>
    <element name="algorithm">
     <type>
      <fromClass class="ALGORITHM" fieldName="id"/>
     </type>
    </element>
    <optional>
     <element name="parameters">
      <type>
       <fromClass class="ALGORITHM" fieldName="Type"/>
      </type>
     </element>
    </optional>
   </sequence>
  </type>
 </namedType>

 <namedClass name="ALGORITHM">
  <class>
   <optional>
    <typeField name="Type"/>
   </optional>
   <valueField name="id" unique="true"
               type="asnx:OBJECT-IDENTIFIER"/>
  </class>
 </namedClass>

</asnx:module>
