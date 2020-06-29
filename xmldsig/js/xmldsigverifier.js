"use strict";

var WebCrypto = require("node-webcrypto-ossl");
var crypto = new WebCrypto.Crypto();

var args = process.argv.slice(2);

const XmlDSigJs = require("xmldsigjs");
const fs = require('fs');

XmlDSigJs.Application.setEngine("WebCrypto", crypto);

for (var i=2; i<process.argv.length; i++) {
    verify(process.argv[i]);
}

function verify(xml_file) {
    let doc = XmlDSigJs.Parse(fs.readFileSync(xml_file).toString());
    let signature = doc.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");

    let signedXml = new XmlDSigJs.SignedXml(doc);
    signedXml.LoadXml(signature[0]);

    signedXml.Verify()
        .then(res => {
            if (res == true) {
                console.log("[  OK  ] " + xml_file);
            } else {
                console.log("[FAILED] " + xml_file);
            }
        })
        .catch(e => {
            console.log("[FAILED] " + xml_file);
            //console.log(e)
        });
}
