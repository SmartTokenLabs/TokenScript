# Demonstrate how to verify XMLDSIG signature in every programming language

This repository serves to show how to verify XMLDSig signature in every programming language by producing a dsigverifier commandline utility in as any programming languages as possible. It's use is not limited to TokenScript, but it may serve a starting point for anyone who wish to implement TokenScript, as the first thing you do with them is, typically, to verify its signature.

## Usage

In all following examples, assume you have cloned [TokenScript-Repo](https://github.com/AlphaWallet/TokenScript-Repo) - a nop-exhaustive TokenScript collection - into your home directory (`~/TokenScript-Repo`) for testing purpose.


### JavaScript *(not working for many files due to a bug in a JavaScript library)*

First, install the dependencies:

    $ cd js
    $ npm install

Then run node.js:

    $ node xmldsigverifier.js ~/TokenScript-Repo/aw.app/2020/06/*

**Note that at this stage half of the tokenscripts fails validation due to a bug in a dependent JavaScript libraries** (not due to a bug in the code of this repository)

Sample output:

    [FAILED] TokenScript-Repo/aw.app/2020/06/COMP.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/daiPool.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/EntryToken.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/fifa.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/GFO-TokenScript.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/GFT-TokenScript.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/karma.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/magazine.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/NEST.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/saiPool.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/sethPool.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/UEFA.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/unicon.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/usdcPool.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/wbtcPool.tsml
    [FAILED] TokenScript-Repo/aw.app/2020/06/wethPool.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/aDAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cBAT.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cDAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cETH.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cREP.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cSAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cUSDC.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cWBTC.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/cZRX.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/DAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/ENS.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/mDAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/mETH.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/mUSDC.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/pDAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/pETH.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/pUSDT.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/SAI.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/USDC.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/USDx.tsml
    [  OK  ] TokenScript-Repo/aw.app/2020/06/WETH.tsml
