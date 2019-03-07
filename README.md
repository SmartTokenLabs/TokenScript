# Tokenscript

Tokenscript is a program interface for tokenisation.

A token's modeler, typically the author of smart contracts dictating
the token's transaciton rules, writes tokenscript and signs it.

Both a Dapp browser and a web application (called Dapp in Ethereum)
make use of such a signed Tokenscript to visually render the token and
provide trustworthy signed transactions about the token.

This project holds:

doc
:   documents about the language and the design

lib/brower
:   browser plugin-support of Tokenscript

lib/web
:    library for Dapps to render tokens in the case the dapp-browser does
not support Tokenscript. Some features are not available
(e.g. switching nodes or accessing multiple Plasma Chain) as they
require underlying dapp browser support.
