/**
 * Compare filter string to object
 * @param str
 * @param props
 * @param debug
 * @returns {string}
 */
export function compareStringToProps(str, props, debug = false){
    if (!str || !str.trim()) {
        debug && console.log('empty filter');
        return 1;
    }
    let match = str.matchAll(/(\([^)(]+\))/g);
    let matchAll = Array.from(match);
    debug && console.log('matchAll');
    debug && console.log(matchAll);
    matchAll.forEach(item=>{
        let single = item[1];
        // console.log('wrong pattern : ' + item + ', skipped');
        let matchProp = single.match(/\(([^<>=]+)(=|<=|>=)([^<>=]+)\)/);
        if (!matchProp) {
            str = str.replace(single,0);
            debug && console.log('wrong pattern : ' + single + ', skipped, str = "'+ str +'"');
            return;
        }
        debug && console.log('matchProp');
        debug && console.log(matchProp);
        let propName = matchProp[1].trim();
        let propCompare = matchProp[2];
        let propTest = matchProp[3].trim();
        let propValue = props[propName];

        if (!propValue) {
            debug && console.log('property check false(prop not exists or empty) for: '+ propName + ', while serve '+item[0]);
            str = str.replace(item[0],'0');
        } else {
            // let compareRes = propValue.match(//);
            let result;
            switch (propCompare) {
                case '=':
                    if (propTest.trim() == '*') {
                        result = '1';
                        break;
                    }
                    // quote all regex symbols except of *
                    var re = new RegExp(propTest.replace(/([.?+^$[\]\\(){}|-])/g, "\\$1"));
                    result = propValue.match(re);
                    break;
                case "<=":
                    result = parseFloat(propValue) < parseFloat(propTest);
                    debug && console.log('propValue = '+ parseFloat(propValue) + " ; propTest = " + parseFloat(propTest) + "; compare = " + propCompare + " ; result = "+result);
                    break;
                case ">=":
                    result = parseFloat(propValue) > parseFloat(propTest);
                    break;
                default:
                    debug && console.log('compare string error. wrong part: '+matchProp[0]+' at the moment: '+str);
                    str = "-1";
            }
            str = str.replace(item[0], result ? '1' : '0');
        }
        debug && console.log('compare string result after : '+single+' = '+str);
    })

    let counter = 0;
    while ((matchAll = Array.from((match = str.matchAll(/(\(([!|&]?)([^)(]+)\))/g)))).length) {
        debug && console.log('matchAll');
        debug && console.log(matchAll);
        matchAll.forEach(item=>{
            let inner = item[0];
            let compare = item[2];
            let bits = item[3];
            switch (compare) {
                case '':
                    switch(inner) {
                        case '(1)':str = str.replace(item[0], '1');
                            break;
                        case '(0)':str = str.replace(item[0], '0');
                            break;
                        default:
                            console.log('compare string error. wrong part: '+inner+' at the moment: '+str);
                            str = "-1";
                    }
                    break;
                case "!":
                    switch(inner) {
                        case '(!1)':str = str.replace(item[0], '0');
                            break;
                        case '(!0)':str = str.replace(item[0], '1');
                            break;
                        default:
                            debug && console.log('compare string error. wrong part: '+inner+' at the moment: '+str);
                            str = "-1";
                    }
                    break;
                case "|":
                    str = str.replace(item[0], bits.includes('1') ? '1' : '0');
                    break;
                case "&":
                    str = str.replace(item[0], bits.includes('0') ? '0' : '1');
                    break;
                default:
                    debug && console.log('compare string error. wrong part: '+inner+' at the moment: '+str);
                    str = "-1";
            }
            debug && console.log('second pass temp res = '+str);

            // let innerMatch
        })
        debug && console.log('second pass cycle '+counter+' finish res = '+str);
        counter ++;
        if (counter > 5) {
            debug && console.log('its loop, check string please: '+str);
            str = "-1";
            break;
        }
    };

    debug && console.log('finish res = '+str);

    return parseInt(str);
}

/**
 * Return Ethers.JS network data
 * @returns {Promise<{userAddress: *, provider: *, chainID: *, signer: *}>}
 */
export async function getEthersData(){
    await ethereum.enable();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if (!signer) throw new Error("Active Wallet required");

    const userAddress = await signer.getAddress();
    const networkInfo = await provider.getNetwork();

    if (networkInfo) {
        var chainID = networkInfo.chainId;
    } else {
        throw new Error("Cant read chainID");
    }
    return { provider, signer, userAddress, chainID };
}

/**
 * Get Token Expire date and compare to today
 * @returns {boolean}
 */
export function isTokenExpired(){
    // name for <meta name="token-expiry" content=">=2018-04-04"/>
    const tokenExpireMetaName = 'token-expiry';
    const TokenExpireMetaNode = document.querySelector('meta[name="'+tokenExpireMetaName+'"]');
    if (TokenExpireMetaNode) {
        const expire = TokenExpireMetaNode.getAttribute('content');
        if (expire) {
            const found = expire.match(/\s*([<>=]{1,2})\s*([\d\-]+)\s*/);
            if (found[2] && found[1]){
                const expireDate = new Date(found[2]);
                const today = new Date();
                switch (found[1]) {
                    case '>':
                        if (today <= expireDate ) return true;
                        break;
                    case '>=':
                        if (today < expireDate ) return true;
                        break;
                    case '<':
                        if (today >= expireDate ) return true;
                        break;
                    case '<=':
                        if (today > expireDate ) return true;
                        break;
                }
            }
        }
    }
}

/**
 * Parse
 * @param xmlDoc
 * @param ethContract
 * @param tokenXmlNode
 * @param chainID
 * @returns {{contractInterface: *, contractAddress: *}}
 */
export function getContractAddress(xmlDoc, ethContract, tokenXmlNode, chainID){

    let contractNode = getXMLItem(xmlDoc,'ts:contract[@name="'+ethContract+'"][1]',tokenXmlNode);
    if (contractNode){
        var contractInterface = contractNode.getAttribute('interface');
        var contractAddress = getXMLItemText(xmlDoc,'ts:address[@network='+chainID+'][1]',contractNode);
    }

    return {
        contractInterface, contractAddress
    }
}

/**
 * parse XML and return innerHTML value by selector (XPath)
 * @param xmlDoc
 * @param selector
 * @param context
 * @param fallbackSelector
 * @param debug
 * @returns {*}
 */
export function getXMLItemText(xmlDoc, selector, context = '', fallbackSelector = '', debug = false){
    let item;
    if (item = getXMLItem(xmlDoc, selector, context, fallbackSelector)) {
        return item.innerHTML;
    } else {
        debug && console.log(selector);
        debug && console.log('Cant find value');
    }
}

/*
parse XML and return innerHTML value by selector (XPath)
*/
export function getXMLItem(xmlDoc, selector, context = '' ,fallbackSelector = ''){
    context = context ? context : xmlDoc;
    let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
    let xmlNode;

    xmlNode = xmlDoc.evaluate(selector, context, nsResolver, XPathResult.ANY_TYPE, null );
    xmlNode = (xmlNode && !fallbackSelector) ? xmlNode : xmlDoc.evaluate(fallbackSelector, context, nsResolver, XPathResult.ANY_TYPE, null );

    return xmlNode ? xmlNode.iterateNext() : false;
}

/**
 * Method for simple handle Promices, like "const [error, result] = await to(someAsyncData());"
 * @param { Promise } promise
 * @param { Object } improved - If you need to enhance the error.
 * @return { Promise }
 * @return [error, result]
 */
export function to(promise, improved){
    return promise
        .then((data) => [null, data])
        .catch((err) => {
            if (improved) {
                Object.assign(err, improved);
            }

            return [err]; // which is same as [err, undefined];
        });
}

/**
 * returns
 * @param ethContract
 * @param jsons
 * @param path
 * @param debug
 * @returns {Promise<*>}
 */

export async function getJSONAbi(ethContract, jsons, path = '', debug = false){
    let contractJson = jsons ? jsons[ethContract] : false;

    if (contractJson) return contractJson;

    try {
        let response = await fetch(path + ethContract + '.json');
        if (response.status !== 200) {
            const message = 'Looks like there was a problem. Status Code: ' +
                response.status;
            debug && console.log(message);
            throw new Error(message);
        }
        contractJson = await response.json();
        jsons[ethContract] = contractJson;

    } catch (e) {
        let message = 'token JSON fetch error. ' + e;
        debug && console.log(e);
        debug && console.log(message);
        // throw new Error(message);
        return false;
    }

    return contractJson;
}

/**
 * Convert Contact filter results to readable values and extends it with  common token props
 * @param resArgs
 * @param incomeProps
 * @returns {*}
 */
export function filterResultConverter(resArgs, incomeProps) {
    // console.log('filterResultConverter input = ');
    // console.log(resArgs);
    let resultProps = Object.assign({}, incomeProps);
    ['owner', 'spender', 'from', 'to'].forEach(arg => {
        if (resArgs['_' + arg]) resultProps[arg] = resArgs['_' + arg];
    });
    ['value', 'amount'].forEach(arg => {
        if (resArgs['_' + arg]) resultProps[arg] =
            resArgs['_' + arg]._isBigNumber
                ? bnStringPrecision(resArgs['_' + arg], resultProps['decimals'], 12)
                : resArgs['_' + arg];
    })
    // console.log('resultProps');
    // console.log(resultProps);
    return resultProps;
}

/**
 * To avoid integer overflow it convert bigint using decimapls value and some precision (precision max 15)
 * @param bn
 * @param decimals
 * @param precision
 * @returns {number}
 */
export function bnStringPrecision(bn, decimals, precision){
    bn = ethers.BigNumber.from(bn);
    if (precision > 15) precision = 15;
    // while (precision > 15){
    //     bn = bn.mul(10**15);
    //     precision -= 15;
    // }
    bn = bn.mul(10**precision);

    while (decimals > 15){
        bn = bn.div(10**15);
        decimals -= 15;
    }
    bn = bn.div(10**decimals);

    return bn.toNumber() / 10**precision;
}

/**
 *
 * @param userAddress
 * @param tokenId
 * @param chainID
 * @param ethereumNode
 * @param xmlDoc
 * @param attributeName
 * @param tokenXmlNode
 * @param tokenName
 * @param debug
 * @returns {boolean|{missedAttribute: *, contract: *, ethCallAttributtes: *, params: *}}
 */
export function getEthereumCallParams({userAddress, tokenId, chainID , ethereumNode , xmlDoc, attributeName, tokenXmlNode, tokenName, debug}){

    let missedAttribute;

    tokenId = tokenId ? tokenId : '';

    // get default contract Name
    let xmlNode = getXMLItem(xmlDoc,'ts:origins/ts:ethereum[1]', tokenXmlNode);
    let defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';
    defaultContract = defaultContract ? defaultContract : tokenName;

    var params = [];

    if (!ethereumNode) {
        ethereumNode = getXMLItem(xmlDoc, 'ts:attribute[@name="' + attributeName + '"]/ts:origins/ethereum:call[1]', tokenXmlNode);
    }

    if (!ethereumNode) {
        console.log('cant find attribute');
        return false;
    }

    var atts = ethereumNode.getAttributeNames();
    var ethCallAttributtes = {};
    atts.forEach(attName=>{
        ethCallAttributtes[attName] = ethereumNode.getAttribute(attName);
    });

    ethCallAttributtes.contract = ethCallAttributtes.contract ? ethCallAttributtes.contract : defaultContract;

    var contract = getContractAddress(xmlDoc, ethCallAttributtes.contract, tokenXmlNode, chainID);

    if (!contract.contractAddress) {
        debug && console.log('Contract address required. chainID = '+chainID);
        return false;
    }

    let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
    let xmlNodeSet = xmlDoc.evaluate('ts:data/*', ethereumNode, nsResolver, XPathResult.ANY_TYPE, null );

    let item;

    while (xmlNodeSet && (item = xmlNodeSet.iterateNext())){
        let ref = item.getAttribute('ref');

        switch (ref) {
            case 'ownerAddress':
                debug && console.log('ownerAddress = '+userAddress);
                params.push(userAddress);
                break;
            case 'tokenId':
                if(tokenId) {
                    params.push(tokenId);
                } else {
                    missedAttribute = 'tokenId';
                }
                break;
            default:
                debug && console.log('item.innerHTML');
                debug && console.log(item.innerHTML);
                if (item.innerHTML) params.push(item.innerHTML);
        }
    }

    return {
        params,
        ethCallAttributtes,
        contract,
        missedAttribute
    };

}

/**
 * Parse ERC20 events and display to console
 * @param erc20EventName
 * @param xmlDoc
 * @param tokenXMLNode
 * @returns {boolean}
 */
export function getErc20EventParams(erc20EventName, xmlDoc, tokenXMLNode){
    let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);

    const eventXmlNodes = xmlDoc.evaluate('asnx:module[@name="ERC20-Events"]/namedType[@name="'+erc20EventName+'"]', tokenXMLNode, nsResolver, XPathResult.ANY_TYPE, null );



    let params = {};

    let moduleNode;
    if (moduleNode = eventXmlNodes.iterateNext()) {

        let eventElementsXmlNodes = xmlDoc.evaluate('type/sequence/element', moduleNode, nsResolver, XPathResult.ANY_TYPE, null );

        let eventElementsXmlNode; ;
        while ( eventElementsXmlNode = eventElementsXmlNodes.iterateNext() ) {
            params[eventElementsXmlNode.getAttribute('name')] = null;
        }
    } else {
        return false;
    }

    return params;
}












