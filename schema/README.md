# TokenScript Schema

TokenScript schema serves to check if your TokenScript is with the correct syntax.

This namespace identifies the current schema:

    http://tokenscript.org/2020/06/tokenscript

When there is a minor change with the addition of new features and elements, we update the schema without invalidating the old TokenScripts that are already signed and put to use. The namespace identifier remains. This process is slow and normally taking months or years.

But every few cycles, evolution leaps forward, and we resort to declaring a new namespace with older elements obsoleted and usage-changed.

The last time it happened was in Jun 2020.

When the namespace change, existing Tokenscripts has to be migrated and re-signed. We will be providing migration tools should that happen again.


### The schema namespace in this repo is above my version; how can I use an older version?

If you have a TokenScript file in an older namespace, they can still be checked for validity, except that they will not run on the latest TokenScript engine implementations unless they explicitly supports outdated TokenScript formats.

If you are the author of such TokenScripts, you should migrate to the current TokenScript namespace. We promise that we make such a change as infrequent as possible.

Example: `http://tokenscript.org/2019/10/tokenscript` was the prior namespace. Old TokenScripts under that namespace can still be found, for example, here:

https://repo.tokenscript.org/aw.app/2019/10/

To make sure the users who didn't upgrade their AlphaWallet can still use the tokens the old way. But they will no longer be updated to include new functions.
