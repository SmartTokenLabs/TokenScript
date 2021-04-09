"use strict";

//const crypto = require('crypto').webcrypto;
import crypto from 'crypto';
import XmlDSigJs from "xmldsigjs";
XmlDSigJs.Application.setEngine("WebCrypto", crypto.webcrypto);

export default function verify(xml_string) {
    let doc = XmlDSigJs.Parse(xml_string);
    let signature = doc.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");

    let signedXml = new XmlDSigJs.SignedXml(doc);
    signedXml.LoadXml(signature[0]);

    return signedXml.Verify()
}

