"use strict";

import fs from 'fs';
import verify from './index.js';

if (process.argv.length == 2) {
	console.log("xmldsigverifier demonstration script. Need parameters - xml files with enveloped signatures")
}

for (var i=2; i<process.argv.length; i++) {
    const filename = process.argv[i];
    verify(fs.readFileSync(filename).toString())
    .then(res => {
        if (res == true) {
            console.log("[  OK  ] " + filename);
        } else {
            console.log("[FAILED] " + filename);
        }
    })
    .catch(e => {
        console.log("[ERROR ] " + filename);
        console.log(e)
    });
}

