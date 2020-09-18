window.Negotiator = (function(){
    let debug = true;
    debug = false;
    let catchDebug = true;
    catchDebug = false;

    let negotiatedTokens = {};

    let ready = false;
    let tokens = {};
    let tokenNodesList = {};
    let select, bar, lang, xmlDoc, nsResolver;
    let web3;
    let jsons = {};
    let config = {
        cssPrefix: "ts_",
        // name for <meta name="token" content="xxx"/>
        tokenMeta: 'token.filter',
        // name for <meta name="token-expiry" content=">=2018-04-04"/>
        tokenExpireMeta: 'token-expiry',
        // fallback content for <meta name="token" content="ethereum:1/0x63cCEF733a093E5Bd773b41C96D3eCE361464942/"/>
        // token: 'ethereum:1/0x63cCEF733a093E5Bd773b41C96D3eCE361464942/',
        // fallback lang
        lang: 'en',
        // not realized yet
        inject_web3: true,
        // "ts:item-view" or "ts:view"
        card_view: 'ts:item-view',
        // "<ts:card name="main" type="token">" or "<ts:card exclude="expired" name="enter" type="action">"
        card_name: 'main',
        card_type: 'action',
        contractJsonPath: ''
    }

    let init = async function(options){
        try {
            // options from main page request
            if (ready) return;

            if (window.location.protocol == 'file:')  throw new Error("Please load this App from HTTP/HTTPS server(local web server should work good), because of browser security reason you can't connect remote server from local file script.");

            if (!window.ethereum) throw new Error("Ethereum Wallet doesnt work at this page, please enable it and reload page.");

            // if (!Web3 && !window.ethers) {
            if (!Web3) {
                // throw new Error("Please load Web3 or ethers.js library before this App");
                throw new Error("Please load Web3 library before this App");
            }
            if (!window.ethers) {
                throw new Error("Please load ethers.js library before this App");
            }

            web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

            lang = parseDocumentLang();
            lang = lang ? lang : config.lang;

            await parseXML();
            await fillTokenList();

            // if (tokens.length)
            bar = bar ? bar : createFloatingBox();

            ready = true;

        } catch (e) {
            let message = ' ;init error happened -> '+e;
            catchDebug && console.log(message);
            catchDebug && console.log(e);
            throw new Error(message);
        }

    }

    /*
    Read JSON
     */
    let getJSONAbi = async function(ethContract){
        // console.log('ethContract');
        // console.log(ethContract);
        // console.log('jsons');
        // console.log(jsons);
        // console.log('after jsons');
        let contractJson = jsons[ethContract];
        // console.log("contractJson");
        // console.log(contractJson);
        if (!contractJson) {
            let response = await fetch(config.contractJsonPath + ethContract + '.json');
            if (response.status !== 200) {
                const message = 'Looks like there was a problem. Status Code: ' +
                    response.status;
                debug && console.log(message);
                throw new Error(message);
            }
            // Examine the text in the response
            // console.log('json fetch resp');
            // console.log(response);
            contractJson = await response.json();
            jsons[ethContract] = contractJson;
            // console.log("contractJson");
            // console.log(contractJson);
        }
        return contractJson;
    }

    /*
    Get document lang
     */
    let parseDocumentLang = function(){
        const HTMLNode = document.querySelector('html');
        let lang;

        if (!HTMLNode) {
            console.error('HTML attribute missed, fallback to english');
        } else {
            lang = HTMLNode.getAttribute('lang');
        }
        return lang;
    }
    /*
    Parse XML file
     */
    let parseXML = async function(){
        try {
            const XMLNode = document.querySelector('link[rel="tokenscript"]');
            if (!XMLNode || !XMLNode.href) throw new Error("Tokenscript link missed");

            // if (isTokenExpired()) throw new Error("Token expired");

            const XMLPath = XMLNode.href;

            const response = await fetch(XMLPath);
            const xmlText = await response.text();
            xmlDoc = await (new window.DOMParser()).parseFromString(xmlText, "text/xml");
            nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);

        } catch (e) {
            let message = ' Fetch XML Error. '+e;
            catchDebug && console.log(e);
            throw new Error(message);
        }
    }

    let fillTokenList = function(){
        var tokenNodes = xmlDoc.evaluate('/ts:token', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
        let tokenNode = tokenNodes.iterateNext();

        while (tokenNode) {
            tokenNodesList[tokenNode.getAttribute('name')] = tokenNode;
            tokenNode = tokenNodes.iterateNext();
        }
    }

    /*
    Get Token Expire date and compare to today
     */
    let isTokenExpired = function(){
        const TokenExpireMetaNode = document.querySelector('meta[name="'+config.tokenExpireMeta+'"]');
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

    let createFloatingBox = function(){
        const bar = document.createElement('div');
        bar.classList.add(config.cssPrefix + 'token_bar');
        bar.innerHTML = '<div class="ts_token_bar_head"><div class="ts_token_bar_icon"></div><div class="ts_token_bar_title">Tokens List</div></div><div class="ts_token_bar_body"><div class="def">No Selected Active Tokens for this Account in this Network</div></div>';
        const body = document.getElementsByTagName('body');
        body[0].appendChild(bar);
        const head = bar.querySelector('.ts_token_bar_head');
        head.addEventListener('click',e=>{
            bar.classList.toggle('opened');
        });

        return bar;
    }

    let createSelectOverlay = function(){
        let body = document.getElementsByTagName('body');
        let select = document.createElement('div');
        select.setAttribute('id','ts_select_token');
        body[0].appendChild(select);

        let html = '<div class="ts_select_box"><div class="ts_close"></div><h2>Select Token</h2><div class="ts_token_list">';

        Object.keys(tokenNodesList).forEach(t=> html += '<div class="ts_token">' + t + '</div>' );
        html +='</div></div>';

        select.innerHTML = html;

        let tokenNodes = select.querySelectorAll('.ts_token');

        tokenNodes.forEach(node=>{
            node.addEventListener('click',async e=>{
                // console.log(node.innerHTML);
                try {
                    await negotiate(node.innerHTML).then(console.log);

                } catch (e) {
                    let message = 'on select. negotiate error = '+e;
                    debug && console.log(message);
                    console.log(e);
                }
                select.classList.add('disabled');

            })
        })

        const closeNode = select.querySelector('.ts_close');
        if (closeNode) closeNode.addEventListener('click',e=>{select.classList.add('disabled')});


        return select;
    }

    /*
    parse XML and return innerHTML value by selector (XPath)
    */
    let getXMLItemText = function (selector, context = ''){
        var item = getXMLItem(selector, context);
        if (item) {
            return item.innerHTML;
        } else {
            debug && console.log(selector);
            debug && console.log('Cant find value');
        }
    }

    /*
    parse XML and return innerHTML value by selector (XPath)
    */
    let getXMLItem = function(selector, context = '' ){
        var xmlNode = xmlDoc.evaluate(selector, context ? context : xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
        return xmlNode.iterateNext();
    }

    /*
    parse single attribute params
    */
    let getAttributeParams = function(func, root, options){
        let {userAddress, tokenId, chainID , attributeNode} = options;

        let xmlNode = getXMLItem('ts:origins/ts:ethereum[1]', root);
        let defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';

        var params = [];

        if (!attributeNode) {
            attributeNode = getXMLItem('ts:attribute[@name="' + func + '"][1]', root);
        }

        if (attributeNode){
            // console.log('attributeNode');
            // console.log(attributeNode);

            xmlNode = getXMLItem('ts:label/ts:string[@xml:lang="'+lang+'"][1]',attributeNode);

            if (xmlNode) {
                var label = xmlNode.innerHTML;
            } else {
                xmlNode = getXMLItem('ts:label/ts:string[@xml:lang="'+config.lang+'"][1]',attributeNode);
                var label = xmlNode ? xmlNode.innerHTML : '';
            }

            xmlNode = getXMLItem('ts:origins/ethereum:call[1]',attributeNode);
            // console.log(attributeNode);
            // console.log(xmlNode);
            var ethFunction = xmlNode.getAttribute('function');
            var ethContract = xmlNode.getAttribute('contract');

            // console.log('ethFunction defined');
            // console.log(ethFunction);

            ethContract = ethContract ? ethContract : defaultContract;

            let contractNode = getXMLItem('ts:contract[@name="'+ethContract+'"][1]',root);
            if (contractNode){
                var contractInterface = contractNode.getAttribute('interface');
                var contractAddress = getXMLItemText('ts:address[@network='+chainID+'][1]',contractNode);
            }
            if (!contractAddress) {
                debug && console.log('Contract address required. chainID = '+chainID);
                return false;
            }

            var ethAs = xmlNode.getAttribute('as');
            var ethType = xmlNode.getAttribute('type');
            var ethSelect = xmlNode.getAttribute('select');

            let xmlNodeSet = xmlDoc.evaluate('ts:origins/ethereum:call/ts:data/*', attributeNode, nsResolver, XPathResult.ANY_TYPE, null );

            let item = xmlNodeSet.iterateNext();

            do {
                let ref = item.getAttribute('ref');

                switch (ref) {
                    case 'ownerAddress':
                        debug && console.log('ownerAddress = '+userAddress);
                        params.push(userAddress);
                        break;
                    case 'tokenId':
                        debug && console.log('this.tokenId = '+tokenId);
                        params.push(tokenId);
                        break;
                    default:
                        debug && console.log('item.innerHTML');
                        debug && console.log(item.innerHTML);
                        if (item.innerHTML) params.push(item.innerHTML);
                }

                item = xmlNodeSet.iterateNext();
            } while (item);

        } else {
            console.log('cant find attribute');
            return false;
        }

        return {
            params,
            ethFunction,
            ethContract,
            ethAs,
            ethType,
            ethSelect,
            label,
            contractInterface,
            contractAddress
        };

    }

    class TokenCard {
        constructor(data) {
            debug && console.log('TokenCard constructor fired');

            this.tokenXMLNode = data.xmlDoc;
            this.nsResolver = data.nsResolver;
            this.tokenName = data.tokenName;
            this.tokenID = data.tokenID;
            this.toRender = data.wrapNode;
            this.lang = data.lang;

            this.fallbackLang = 'en';
            this.ready = false;
            this.parseTokenData();
        }

        /*
        Parse Token specific data
         */
        async parseTokenData(){
            try{

                // this.abi = getJSONAbi(this.contractOriginName);
                // let contractJson
                // The Contract object
                // const ethersContract = new ethers.Contract(this.contractAddress, this.abi, this.provider);


                debug && console.log('render fired;');

                this.toRender.innerHTML = '';

                this.iframe = this.toRender.ownerDocument.createElement('iframe');
                this.iframe.src = "blank.html";
                this.toRender.appendChild(this.iframe);

                return new Promise(resolve => {
                    this.iframe.onload = () => {

                        this.iframeDoc = this.iframe.contentDocument? this.iframe.contentDocument: this.iframe.contentWindow.document;
                        this.iframe.contentWindow.onerror = e=>{console.log('iframe error'); console.log(e);};
                        this.injectIframeContent();
                        this.runParser();
                        resolve();
                    }
                })

            } catch (e) {
                let message = 'parseTokenData error: ' + e;
                catchDebug && console.log(message);
                catchDebug && console.log(e);
                throw new Error(message);
            }

        }

        /*
        Inject helper JS code
         */
        injectIframeContent(){
            let code = this.iframeHelper.toString();
            code = code.substring(15,code.length -1);
            this.insertScript(this.iframeDoc,code);
        }

        runParser(accounts){
            debug && console.log('runParser started');
            // this.account = accounts[0];

            this.cardHtml = getXMLItemText( 'ts:cards/ts:card[@type="token"]/ts:item-view[@xml:lang="' + this.lang + '"][1]', this.tokenXMLNode );
            this.cardHtml = this.cardHtml ? this.cardHtml : getXMLItemText('ts:cards/ts:card[@type="token"]/ts:item-view[@xml:lang="' + this.fallbackLang + '"][1]', this.tokenXMLNode );

            // ethereum.enable().then(a=>{
            //     this.runParser(a);
            //     ethereum.on('accountsChanged', a=>this.runParser(a));
            // });

            const innerBody = this.iframeDoc.getElementsByTagName('body');

            if (innerBody) {
                const origin = document.defaultView.location.origin;

                let html = this.replace_all(this.cardHtml,'<body>','');
                html = this.replace_all(html,'</body>','');

                let div = this.iframeDoc.createElement('div');
                div.innerHTML = html;

                const scripts = div.querySelectorAll('script');

                // setTimeout(()=>{
                //     console.log('this.iframeDoc.is_ethereum_exists()');
                //     console.log(this.iframe.contentWindow.is_ethereum_exists());
                // },1000);

                const iframeEthereumExists = this.iframe.contentWindow.is_ethereum_exists();
                const iframeWeb3Exists = this.iframe.contentWindow.is_web3_exists();

                debug && console.log('iframeEthereumExists = '+iframeEthereumExists);
                debug && console.log('iframeWeb3Exists = '+iframeWeb3Exists);
                if (!iframeEthereumExists || !iframeWeb3Exists) {
                    console.error('Ethereum or web3 missed');
                } else {
                    let code = this.web3TokensExtention.toString();
                    code = code.substring(22,code.length -1);
                    this.insertScript(this.iframeDoc,code);
                }

                // this.insertScript(this.iframeDoc,null, 'web3.min.js');
                if (scripts.length){
                    scripts.forEach(item=>{
                        // let data = {
                        //     action:'inject_script',
                        //     content: this.decodeHtml(item.innerText)
                        // };

                        // iframe.contentWindow.postMessage(JSON.stringify(data),origin);
                        // console.log(item.innerText);
                        this.insertScript(this.iframeDoc,this.decodeHtml(item.innerText));
                        item.remove();
                    })
                }
                innerBody[0].innerHTML = '';
                innerBody[0].appendChild(div);

                // this.getTemplates().then(res=>{
                //     innerBody[0].innerHTML = res;
                // this.fillAllAttributeValues();
                // });


            } else {
                console.log('Cant see iframe body');
            }


        }

        insertScript(doc, inline, src, callback) {
            var s = doc.createElement("script");
            var head = doc.querySelector('head');
            s.type = "text/javascript";
            if(callback) {
                if (s.readyState){  //IE
                    s.onreadystatechange = function(){
                        if (s.readyState == "loaded" ||
                            s.readyState == "complete"){
                            s.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {  //Others
                    s.onload = function(){
                        callback();
                    };
                }
            }
            if (src){
                s.src = src;
            }
            if (inline){
                s.appendChild(doc.createTextNode(inline));
                head.appendChild(s);
            }
        }

        /*
        inject it inside iframe to extend "web3" with property "tokens"
         */
        web3TokensExtention(){
            web3.tokens = {
                all: [],
                definition: {},
            };
        }
        /*
        method to use it inside iframe to receive and handle inline scripts
         */
        iframeHelper(){
            const origin = document.defaultView.location.origin;
            console.log('iframeHelper works');
            function is_ethereum_exists(){
                return !!window.ethereum;
            }
            function is_web3_exists(){
                return !!window.web3;
            }
            /*
                    function add_script(content){
                        console.log('lets add inline script(iframeHelper->add_script)');

                        var s = document.createElement("script");
                        var head = document.querySelector('head');
                        s.type = "text/javascript";
                        if(callback) {
                            if (s.readyState){  //IE
                                s.onreadystatechange = function(){
                                    if (s.readyState == "loaded" ||
                                        s.readyState == "complete"){
                                        s.onreadystatechange = null;
                                        callback('Script loaded');
                                    }
                                };
                            } else {  //Others
                                s.onload = function(){
                                    callback('Script loaded');
                                };
                            }
                        }
                        if (content){
                            s.appendChild(document.createTextNode(content));
                            head.appendChild(s);
                        }
                    }*/
            /*window.addEventListener("message", function(event) {
                if (event.origin != origin) {
                    // something from an unknown domain, let's ignore it
                    console.log('cross-origin disabled');
                    return;
                }



                if (typeof event.data == 'string'){
                    console.log( "received: " );
                    // console.log( event.data );
                    let dataObj;

                    try {
                        dataObj = JSON.parse(event.data);
                        // console.log(dataObj.content);

                    } catch (e) {

                        console.error('Cant parse string');
                        console.error(e);
                        return;
                    }

                    const scriptCb = function(message){
                        const parent = event.source;
                        console.log('try to send postMessage to the parent');
                        console.log(origin);
                        parent.postMessage(JSON.stringify(message),origin);
                    }
                    if (dataObj.action == 'inject_script'){
                        add_script(dataObj.content, scriptCb);
                    }
                }

            });*/
        }


        /*
        fill node content by fetch XML / ETH data
         */
        fillAttribute(node){
            let func = node.getAttribute('data-eth-attribute');
            if (func){
                let labelNode = node.querySelector('[data-eth-type="label"]');
                let valueNode = node.querySelector('[data-eth-type="value"]');
                let result = this.parseAttribute(func, node);
            }
        }

        /*
        parse single attribute - fetch data from XML
         */
        async getAttribute(func, node){
            debug && console.log('try to get '+func);

            let abi = await getJSONAbi(ethContract);

            let parsed = getAttributeParams(func, this.tokenXMLNode,{userAddress});
            let params = parsed.params;

            params.push((error, result) => {
                debug && console.log("result and error");
                debug && console.log(result);
                debug && console.log(error);
                if (!error) {
                    window.res = result;

                    let domNode = node.querySelector('[data-eth-type="value"]');
                    let resultStr;

                    resultStr = result.length ? this.extractresultValue(ethFunction, result, ethSelect,jsons[ethContract].abi) : result.toNumber();

                    if (domNode) {
                        domNode.innerHTML = resultStr;
                    }

                    debug && console.log(result);
                } else
                    console.error(error);
            });

            this.runContractMethod(ethContract, ethFunction, params);


            let domNode = node.querySelector('[data-eth-type="label"]');
            if (domNode) domNode.innerHTML = label;

        }


        /*
        send contract request
         */
        runContractMethod(ethContract, func, params){
            const contract = web3.eth.contract(jsons[ethContract].abi).at(this.contracts[ethContract]);
            debug && console.log(contract);
            debug && console.log(params);
            debug && console.log(contract[func]);

            contract[func].apply(null, params);
        }


        /*
        extract specific value from the result array
         */
        extractresultValue(func, result, select, abi){
            let out;
            abi.forEach((item)=>{
                // console.log(item);
                if (item.name == func) {
                    item.outputs.forEach(function(outputParam, index){
                        if (outputParam.name == select) {
                            debug && console.log('parameter found');
                            out = result[index].toNumber();
                        }
                    });
                }
            })
            return out;
        }

        /*
        go though all child nodes with set attribute
         */
        fillAllAttributeValues(){
            let rootNode = this.iframe;
            let nodes = rootNode.querySelectorAll('[data-eth-attribute]');
            let i;
            cl(nodes.length);
            for (i=0; i < nodes.length; i++){
                this.fillAttribute(nodes[i]);
            }
        }

        /*
        replace ENTITIES ( format &xxxxx; ) with files content (shtmls, styles) for card template
         */
        // async getTemplates() {
        //     var thisCard = this.cardHtml;
        //     try {
        //         var matched;
        //         for (var key in this.files){
        //             // console.log(files[key], key);
        //             let reg = '%%%'+key+';';
        //             matched = thisCard.includes(reg);
        //             if (matched) {
        //                 let _key = key;
        //                 let response = await fetch(this.files[key]);
        //                 let content = await response.text();
        //                 thisCard = this.replace_all(thisCard,'%%%'+_key+';',content);
        //             }
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        //     return thisCard;
        // }

        /*
        replace all "src" sub-strings with "dst"
         */
        replace_all(str,src, dst){
            return str.split(src).join(dst);
        }

        decodeHtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        }
    }

    /*
    Get Token Name from Meta tag
     */
    let getTokenName = ()=>{
        const TokenMetaNode = document.querySelector('meta[name="'+config.tokenMeta+'"]');
        if (!TokenMetaNode) return;

        const content =  TokenMetaNode.content ? TokenMetaNode.content : '';
        const filter = content.match(/objectClass=(\S+)/);

        // return filter[1] ? filter[1] : config.token;
        return filter[1];
    }

    let getEthersData = async function(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        if (!signer) throw new Error("Active Wallet required");

        const userAddress = await signer.getAddress();
        // console.log('userAddress = ' + userAddress);

        const networkInfo = await provider.getNetwork();
        if (networkInfo) {
            var chainID = networkInfo.chainId;
        } else {
            throw new Error("Cant read chainID");
        }

        return { provider, signer, userAddress, chainID }
    }




    let getTokenIDs = async function(tokenName){
        try {
            const ethersData = await getEthersData();
            const {provider,signer,userAddress,chainID} = ethersData;

            debug && console.log('ethersData');
            debug && console.log(ethersData);

            let distinctAttributeNode = getXMLItem('ts:attribute[@distinct="true"][1]',tokenNodesList[tokenName]);

            if (!distinctAttributeNode) {
                debug && console.log("Cant find distinct attribute, lets use ownerAddress");
                return ['ownerAddress='+userAddress];
            }

            // methodattributes = {params,ethFunction,ethContract,ethAs,ethType,ethSelect,label};
            methodattributes = getAttributeParams(false,tokenNodesList[tokenName],{userAddress,chainID,attributeNode: distinctAttributeNode});
            let params = methodattributes.params;

            debug && console.log('methodattributes');
            debug && console.log(methodattributes);

            if (!methodattributes) throw new Error(' getAttributeParams failed for {Address='+userAddress+', chainID = '+chainID+' , tokenName = '+tokenName+'}. Check logs for details');

            const abi = await getJSONAbi(methodattributes.ethContract);

            if (!methodattributes.contractAddress) throw new Error("Cant get token contract address");

            const contract = new ethers.Contract(methodattributes.contractAddress, abi, provider);
            let output = await contract[methodattributes.ethFunction].apply(null, params);

            debug && console.log('contract method output');
            debug && console.log(output);

            if (output && output.length) {
                let out = [];
                output.forEach(a=>{out.push('tokenID='+a._hex)});
                return out;
            } else {
                throw new Error('Empty token list');
            }

            // params.push((error, result) => {
            //     console.log("result and error");
            //     console.log(result);
            //     console.log(error);
            //     if (!error) {
            //         // window.res = result;
            //         console.log(res);
            //         let resultStr;
            //
            //         resultStr = result.length ? this.extractresultValue(ethFunction, result, ethSelect,jsons[ethContract].abi) : result.toNumber();
            //
            //         console.log(result);
            //     } else
            //         console.error(error);
            // });



        } catch (e) {
            let message = 'Cant get token IDs: ' + e;
            catchDebug && console.log(message);
            catchDebug && console.log(e);
            throw new Error(message);
        }

    }

    let negotiate = async function(tokenName, options){
        negotiatedTokens[tokenName] = options;
        try {
            await init(options);
            debug && console.log('negotiate fired for '+tokenName);

            const tokenNodes = bar.querySelectorAll('.ts_token_bar_body .ts_token_wrap[data-tokenname="'+tokenName+'"]');
            if (tokenNodes.length) tokenNodes.forEach(node=>node.remove());
            let tokenIDs = await getTokenIDs(tokenName);
            debug && console.log('tokenIDs = '+tokenIDs);

            if (!tokenIDs) throw new Error('Address in this network doesnt have token IDs.');

            tokenIDs.forEach(tokenID=>{
                const barBody = bar.querySelector('.ts_token_bar_body');
                const wrap = document.createElement('div');
                wrap.setAttribute('data-tokenname',tokenName);
                wrap.setAttribute('data-tokenid',tokenID);
                wrap.classList.add('ts_token_wrap');
                barBody.appendChild(wrap);

                // tokenInstances[tokenName] =
                    new TokenCard({
                    // xmlDoc,
                    xmlDoc: tokenNodesList[tokenName],
                    wrapNode: wrap,
                    lang,
                    nsResolver,
                    tokenName,
                    tokenID
                });

                var event = new CustomEvent('ontokennegotiation', { 'detail': {tokenName,tokenID} });
                window.dispatchEvent(event);
            });



            bar.classList.add('opened');

            // return tokenCard;

        } catch (e) {
            let message = 'negotiate error = '+e;
            catchDebug && console.log('negotiate error');
            catchDebug && console.log(e);
            throw new Error(message);
        }


    }
    // let getToken = async function(name){
    //     if (!tokens[name]) {
    //         try {
    //             return await negotiate(name);
    //         } catch (e) {
    //             let message = 'getToken. negotiate error = '+e;
    //             catchDebug && console.log(message);
    //             catchDebug && console.log(e);
    //         }
    //     }
    //     return tokens[name];
    // };
    let selectTokenFromList = function(options = {}){
        init(options).then(res=>{
            try {
                // console.log('init res');
                // console.log(res);

                debug && console.log('init OK');
                if (Object.keys(tokenNodesList).length){
                    select = select ? select : createSelectOverlay();
                    select.classList.remove('disabled');
                } else {
                    console.log('Cant see tokens.');
                }

            } catch (e) {
                console.error(e);
            }
            //res={xmlDoc,nsResolver}
        }).catch(e=>console.log);
    }



    const metaDefinedTokenName =  getTokenName();
    if (metaDefinedTokenName){
        try {
            negotiate(metaDefinedTokenName).then(e=>{bar.classList.remove('opened');});
        } catch (e) {
            let message = 'negotiate error = '+e;
            catchDebug && console.error('negotiate error');
            console.error(e);
        }
    }

    let renegotiate = function(){
        Object.keys(negotiatedTokens).forEach(key=>{
            negotiate(key,negotiatedTokens[key]).then(e=>{console.log('renegotiated',e)}).catch(console.log);
        })
    }

    ethereum.on('accountsChanged', renegotiate);
    ethereum.on('chainChanged', renegotiate);

    return {
        negotiate,
        // getToken,
        selectTokenFromList
    }
})();


/*
        window.addEventListener("message", function(event) {
            if (event.origin != origin) {
                // something from an unknown domain, let's ignore it
                console.log('cross-origin disabled');
                return;
            }
            // if (typeof event.data == 'string'){
            //     try {
            //         const dataObj = JSON.parse(event.data);
            //         console.log(dataObj);
            //         const scriptCb = function(message){
            //             const parent = event.source;
            //             parent.postMessage(JSON.stringify(message),origin);
            //         }
            //         if (dataObj.action == 'add_script'){
            //             add_script(dataObj.content, scriptCb);
            //         }
            //
            //     } catch (e) {
            //
            //         console.error('Cant parse string');
            //         console.error(e);
            //     }
            // }
        });*/