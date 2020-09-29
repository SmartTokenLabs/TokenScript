window.Negotiator = (function(){
    let debug = true;
    debug = false;
    let catchDebug = true;
    // catchDebug = false;

    let negotiatedTokens = {};

    let ready = false;
    let tokens = {};
    let tokenNodesList = {};
    let select, bar, lang, ethersData;
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


    async function init(options){
        try {
            if (!ready) {

                if (window.location.protocol == 'file:') throw new Error("Please load this App from HTTP/HTTPS server(local web server should work good), because of browser security reason you can't connect remote server from local file script.");

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

                // if (tokens.length)
                createFloatingBox();

                ready = true;
            }

        } catch (e) {
            let message = ' ;init error happened -> ' + e;
            catchDebug && console.log(message);
            catchDebug && console.log(e);
            throw new Error(message);
        }
    }

    /*
    Read JSON
     */
    let getJSONAbi = async function(ethContract){
        try {
            let contractJson = jsons[ethContract];
            if (!contractJson) {
                let response = await fetch(config.contractJsonPath + ethContract + '.json');
                if (response.status !== 200) {
                    const message = 'Looks like there was a problem. Status Code: ' +
                        response.status;
                    debug && console.log(message);
                    throw new Error(message);
                }
                contractJson = await response.json();
                jsons[ethContract] = contractJson;
            }
            return contractJson;
        } catch (e) {
            let message = 'token JSON fetch error. '+e;
            catchDebug && console.log(e);
            throw new Error(message);
        }

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
            const XMLNodes = document.querySelectorAll('link[rel="tokenscript"]');
            if (!XMLNodes) throw new Error("Tokenscript link missed");

            // if (isTokenExpired()) throw new Error("Token expired");

            // XMLNodes.forEach(XMLNode=>{
            for (let i=0; i < XMLNodes.length; i++){
                const XMLPath = XMLNodes[i].href;
                const response = await fetch(XMLPath);
                const xmlText = await response.text();
                let xmlDoc = await (new window.DOMParser()).parseFromString(xmlText, "text/xml");

                fillTokenList(xmlDoc);
            }


        } catch (e) {
            let message = ' Fetch XML Error. '+e;
            catchDebug && console.log(message);
            catchDebug && console.log(e);
            throw new Error(message);
        }
    }

    let fillTokenList = function(xmlDoc){
        let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);

        let tokenNodes = xmlDoc.evaluate('/ts:token', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
        let tokenNode = tokenNodes.iterateNext();

        while (tokenNode) {
            tokenNodesList[tokenNode.getAttribute('name')] = {
                tokenRootNode: tokenNode,
                xmlDoc: xmlDoc
            };
            tokenNode = tokenNodes.iterateNext();
        }

        // debug && console.log('tokenNodesList');
        // debug && console.log(tokenNodesList);
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
        if (bar) return;

        bar = document.createElement('div');
        bar.classList.add(config.cssPrefix + 'token_bar');
        bar.innerHTML = '<div class="ts_token_bar_head"><div class="ts_token_bar_icon"></div><div class="ts_token_bar_title">Tokens List</div></div><div class="ts_token_bar_body"><div class="def"></div></div>';
        const body = document.getElementsByTagName('body');
        body[0].appendChild(bar);
        const head = bar.querySelector('.ts_token_bar_head');
        head.addEventListener('click',e=>{
            bar.classList.toggle('opened');
            e.preventDefault();
            // return false;
        });

        setDefMessageAndBtn();
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
    let getXMLItemText = function (xmlDoc, selector, context = '', fallbackSelector = ''){
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
    let getXMLItem = function(xmlDoc, selector, context = '' ,fallbackSelector = ''){
        context = context ? context : xmlDoc;
        let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
        let xmlNode;

        xmlNode = xmlDoc.evaluate(selector, context, nsResolver, XPathResult.ANY_TYPE, null );
        xmlNode = (xmlNode && !fallbackSelector) ? xmlNode : xmlDoc.evaluate(fallbackSelector, context, nsResolver, XPathResult.ANY_TYPE, null );

        return xmlNode ? xmlNode.iterateNext() : false;
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
     * @returns {boolean | {ethSelect: *, ethContract: *, contractInterface: *, ethFunction: *, contractAddress: *, ethType: *, label: *, params: *, ethAs: *}}
     */
    function getEthereumCallParams({userAddress, tokenId, chainID , ethereumNode , xmlDoc, attributeName, tokenXmlNode, tokenName}){

        // get default contract Name
        let xmlNode = getXMLItem(xmlDoc,'ts:origins/ts:ethereum[1]', tokenXmlNode);
        let defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';
        defaultContract = defaultContract ? defaultContract : tokenName;

        var params = [];

        if (!ethereumNode) {
            ethereumNode = getXMLItem(xmlDoc, 'ts:attribute[@name="' + attributeName + '"]/ts:origins/ethereum:call[1]', tokenXmlNode);
        }

        // console.log('ethereumNode');
        // console.log(ethereumNode);
        // console.log(attributeName);

        if (ethereumNode){
            // console.log('attributeNode');
            // console.log(attributeNode);

            // xmlNode = getXMLItem(xmlDoc,'ts:label/ts:string[@xml:lang="'+lang+'"][1]',ethereumNode, 'ts:label/ts:string[@xml:lang="'+config.lang+'"][1]');
            // var label = xmlNode ? xmlNode.innerHTML : '';

            // xmlNode = getXMLItem(xmlDoc,'ts:origins/ethereum:call[1]',ethereumNode);
            // console.log(attributeNode);
            // console.log(xmlNode);
            var ethAs = ethereumNode.getAttribute('as');
            var ethType = ethereumNode.getAttribute('type');
            var ethSelect = ethereumNode.getAttribute('select');
            var ethFunction = getAttributeIfExists('function',ethereumNode);
            var ethContract = getAttributeIfExists('contract',ethereumNode);
            ethContract = ethContract ? ethContract : defaultContract;


            // console.log('ethFunction defined');
            // console.log(ethFunction);

            // console.log('vars:');
            // console.log(ethFunction,ethContract,chainID);
            // console.log(userAddress, tokenId, attributeNode , attributeName);
            // // console.log(xmlNode);
            // console.log(ethContract);
            // console.log(defaultContract);
            // console.log('vars: --- end');


            var { contractInterface, contractAddress } = getContractAddress(xmlDoc, ethContract, tokenXmlNode, chainID);

            if (!contractAddress) {
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
                        debug && console.log('this.tokenId = '+tokenId);
                        params.push(tokenId);
                        break;
                    default:
                        debug && console.log('item.innerHTML');
                        debug && console.log(item.innerHTML);
                        if (item.innerHTML) params.push(item.innerHTML);
                }
            }

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
            contractInterface,
            contractAddress
        };

    }

    let getContractAddress = function (xmlDoc, ethContract, tokenXmlNode, chainID){

        // debug && console.log('getContractAddress vars');
        // debug && console.log(ethContract, chainID);

        let contractNode = getXMLItem(xmlDoc,'ts:contract[@name="'+ethContract+'"][1]',tokenXmlNode);
        if (contractNode){
            var contractInterface = contractNode.getAttribute('interface');
            var contractAddress = getXMLItemText(xmlDoc,'ts:address[@network='+chainID+'][1]',contractNode);
        }

        return {
            contractInterface, contractAddress
        }
    }

    function getAttributeIfExists(param, node){
        let value;
        if (value = node.getAttribute(param)) return value;
        return false;
    }

    function bnStringPrecision(bn, decimals, precision){
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

    class TokenCard {
        constructor(data) {
            debug && console.log('TokenCard constructor fired');

            this.xmlDoc = data.xmlDoc;
            this.tokenXMLNode = data.tokenXMLNode;
            this.tokenName = data.tokenName;
            this.tokenID = data.tokenID;
            this.toRender = data.wrapNode;
            this.lang = data.lang;
            this.ethersData = data.ethersData;
            this.activitiesRenderStarted = false;

            this.fallbackLang = 'en';
            this.ready = false;

            this.nsResolver = this.xmlDoc.createNSResolver( this.xmlDoc.ownerDocument == null ? this.xmlDoc.documentElement : this.xmlDoc.ownerDocument.documentElement);

            let xmlNode = getXMLItem(this.xmlDoc,'ts:origins/ts:ethereum[1]', this.xmlDoc);
            this.defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';
            this.defaultContract = this.defaultContract ? this.defaultContract : this.tokenName;

            this.getProps().then((props)=>{
                this.mainProps = props;
                debug && console.log('global props fetched.');

                // this.addCardIframe(this.toRender);

                this.renderCardView(this.toRender, "main", "token", 'item-view');
            });
        }
        addCardIframe(wrapper, callback){
            debug && console.log('render fired;');

            wrapper.innerHTML = '<div class="sidebar_toggle"> &lt; Show Activities</div>';

            let iframe = wrapper.ownerDocument.createElement('iframe');

            iframe.src = "blank.html";
            iframe.onload = () => {

                debug && console.log('iframe.onload fired;');
                iframe.contentWindow.onerror = e=>{console.log('iframe error'); console.log(e);};


                let iframeDoc = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;

                /* Inject helper JS code */
                let code = this.iframeHelper.toString();
                code = code.substring(15,code.length -1);
                this.insertScript(iframeDoc,code);

                callback(iframe);

            }

            wrapper.appendChild(iframe);
        }

        async getProps(){
            try {
                await getEthers();

                const attributeXmlNodes = this.xmlDoc.evaluate('ts:attribute', this.tokenXMLNode, this.nsResolver, XPathResult.ANY_TYPE, null );

                var props = {};
                let attributeNode;

                while (attributeXmlNodes && (attributeNode = attributeXmlNodes.iterateNext() ) ) {
                    let name = attributeNode.getAttribute('name');
                    let distinct = attributeNode.getAttribute('distinct');
                    if (distinct) continue;

                    let originsInnerNode = getXMLItem(this.xmlDoc ,'ts:origins/*[1]',attributeNode);
                    if (!originsInnerNode) continue;

                    let dataNodeName = originsInnerNode.nodeName;
                    let res;

                    switch (dataNodeName) {
                        case 'ts:token-id':
                            // res = "542b33000000000000000000000001075b2282";
                            res = this.tokenID;
                            break;
                        case "ethereum:call":
                            let {
                                params,
                                ethFunction,
                                ethContract,
                                ethAs,
                                ethType,
                                ethSelect,
                                label,
                                contractInterface,
                                contractAddress
                            } = getEthereumCallParams({
                                userAddress: this.ethersData.userAddress,
                                chainID: this.ethersData.chainID,
                                ethereumNode: originsInnerNode,
                                xmlDoc: this.xmlDoc,
                                tokenXmlNode: this.tokenXMLNode,
                                tokenName: this.tokenName,
                                tokenId: this.tokenID.replace('tokenID=','')
                            });

                            if (!ethContract && !contractAddress) throw new Error(' ethContract and contractAddress required for {Address='+this.ethersData.userAddress+', chainID = '+this.ethersData.chainID+' , tokenName = '+this.tokenName+'}. Check logs for details');

                            const abi = await getJSONAbi(ethContract);
                            const contract = new ethers.Contract(contractAddress, abi, this.ethersData.provider);
                            debug && console.log('ethFunction = ' + ethFunction + '; name = '+name + '; output = '  );
                            debug && console.log(params);
                            let output = await contract[ethFunction].apply(null, params);


                            debug && console.log(output);
                            // let res = output._isBigNumber ? bnStringPrecision(output,18,8) : output;
                            res = output._isBigNumber ? output.toString() : output;
                            // console.log(res);
                            break;
                    }



                    props[name] = res;
                }
            } catch (e) {
                let message = "getProps() error. "+e;
                catchDebug && console.log(e);
                catchDebug && console.log(message);
                throw new Error(message);
            }
            return props;
        }

        async cardOriginProps(cardNode, callback){
            try {

                debug && console.log('get card origin props');
                debug && console.log(cardNode);

                const ethereumNodes = cardNode && this.xmlDoc.evaluate('ts:origins/ethereum:event', cardNode, this.nsResolver, XPathResult.ANY_TYPE, null );

                var props = this.mainProps;
                let ethereumEventNode;

                while (ethereumNodes && (ethereumEventNode = ethereumNodes.iterateNext() ) ) {

                    debug && console.log('ethereumEventNode');
                    debug && console.log(ethereumEventNode);
                    // ------------------------
                    // ethereum:event
                    var eventFilter = ethereumEventNode.getAttribute('filter');
                    var eventType = ethereumEventNode.getAttribute('type');
                    var ethContract = ethereumEventNode.getAttribute('contract');
                    ethContract = ethContract? ethContract: this.defaultContract;

                    var { contractInterface, contractAddress } = getContractAddress(this.xmlDoc, ethContract, this.tokenXMLNode, this.ethersData.chainID);

                    if (!contractAddress) {
                        debug && console.log('Contract address required. chainID = '+this.ethersData.chainID);
                        throw new Error('Contract address required. chainID = '+this.ethersData.chainID);
                    }

                    let params = this.getErc20EventParams(eventType);

                    if (!params) throw  new Error(eventType+' parameters missing.');

                    const match = eventFilter.match(/(\S+)=(\S+)/);

                    if (match) {
                        let paramName = match[1];
                        let paramValue = match[2];
                        if (paramName in params) {
                            params[paramName] = paramValue == '${ownerAddress}' ? this.ethersData.userAddress : paramValue;
                        }
                    }

                    let paramsArray = [];
                    for(let i in params){
                        paramsArray.push(params[i]);
                    }

                    debug && console.log('eventType');
                    debug && console.log(eventType);

                    debug && console.log('params');
                    debug && console.log(params);

                    let abi = await getJSONAbi(ethContract);

                    if (!ethContract && !contractAddress) throw new Error(' ethContract and contractAddress required for {Address='+this.ethersData.userAddress+', chainID = '+this.ethersData.chainID+' , tokenName = '+this.tokenName+'}. Check logs for details');

                    const contract = new ethers.Contract(contractAddress, abi, this.ethersData.provider);

                    let filter = contract.filters[eventType].apply(null, paramsArray);

                    debug && console.log('filter');
                    debug && console.log(filter);

                    // contract.queryFilter(filter).then(this.cb(eventType + ' where ' + eventFilter));
                    contract.queryFilter(filter).then(callback);

                    // let res = output._isBigNumber ? bnStringPrecision(output,18,8) : output;
                    // let res = output._isBigNumber ? output.toString() : output;
                    // console.log('ethFunction = ' + ethFunction + '; name = '+name + '; res = ' + res );
                    // props[name] = res;
                }
            } catch (e) {
                let message = "getProps() error. "+e;
                catchDebug && console.log(e);
                catchDebug && console.log(message);
                throw new Error(message);
            }
            // callback(props);
        }

        /*
        Parse ERC20 events and display to console
         */
        getErc20EventParams(erc20EventName){
            const eventXmlNodes = this.xmlDoc.evaluate('asnx:module[@name="ERC20-Events"]/namedType[@name="'+erc20EventName+'"]', this.tokenXMLNode, this.nsResolver, XPathResult.ANY_TYPE, null );

            let moduleNode = eventXmlNodes.iterateNext();

            let params = {};

            if (moduleNode) {

                let eventElementsXmlNodes = this.xmlDoc.evaluate('type/sequence/element', moduleNode, this.nsResolver, XPathResult.ANY_TYPE, null );

                let eventElementsXmlNode = eventElementsXmlNodes.iterateNext();
                while (eventElementsXmlNode) {

                    params[eventElementsXmlNode.getAttribute('name')] = null;

                    eventElementsXmlNode = eventElementsXmlNodes.iterateNext();
                }
            } else {
                return false;
            }

            return params;
        }

        cb(type){
            return function(result,error){
                // let iframeDoc = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;
                // var div = iframeDoc.createElement("div");
                // var body = iframeDoc.querySelector('body');
                // div.setAttribute('id','activity');
                // body.appendChild(div);
                //
                // iframe.contentWindow.web3.tokens.data.currentInstance = props;
                // iframe.contentWindow.web3.tokens.dataChanged(null, null,'activity' )
                if (result.length) {
                    console.log('results for '+type)
                    console.log(result)
                } else {
                    console.log('No results for '+type)
                }

                if (error) {
                    console.log('Error');
                    console.log(error);
                }
            }
        }

        async renderCardView(wrapper, name, type, itemType = "item-view"){
            debug && console.log('renderCardView started for name=' + name + '; type = ' + type + '; itemType=' + itemType);

            // this.cardHtml = getXMLItemText(
            //     this.xmlDoc,
            //     'ts:cards/ts:card[@type="activity"]/ts:item-view[@xml:lang="' + this.lang + '"][1]',
            //     this.tokenXMLNode,
            //     'ts:cards/ts:card[@type="activity"]/ts:item-view[@xml:lang="' + this.fallbackLang + '"][1]' );

            let cardHtmlNode = getXMLItem(
                this.xmlDoc,
                'ts:cards/ts:card[@name="' + name + '"][@type="' + type + '"]/ts:'+itemType+'[@xml:lang="' + this.lang + '"][1]',
                this.tokenXMLNode,
                'ts:cards/ts:card[@name="' + name + '"][@type="' + type + '"]/ts:'+itemType+'[@xml:lang="' + this.fallbackLang + '"][1]' );



            let cardHtml = cardHtmlNode ? cardHtmlNode.innerHTML : '';

            if (!cardHtml && name!='main' && type!="token" ) return false;

            cardHtml = cardHtml ? cardHtml : '<h2 style="text-transform: uppercase;">' + this.tokenName + '</h2>';

            this.addCardIframe(wrapper, (iframe)=>{
                let iframeDoc = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;

                if (name=='main' && type=="token") {
                    wrapper.insertAdjacentHTML('beforeend', '<div class="activity_cards"></div>');
                    let sidebarToggle = wrapper.querySelector('.sidebar_toggle');
                    let sidebar = wrapper.querySelector('.activity_cards');
                    sidebarToggle && sidebarToggle.addEventListener('click', () => {
                        sidebar.classList.toggle('opened');
                        if (!this.activitiesRenderStarted) this.activitiesRenderStart(sidebar, itemType);
                    })
                }


                const innerBody = iframeDoc.getElementsByTagName('body');

                if (innerBody) {
                    const origin = document.defaultView.location.origin;

                    let html = this.replace_all(cardHtml,'<body>','');
                    html = this.replace_all(html,'</body>','');

                    let div = iframeDoc.createElement('div');
                    div.innerHTML = html;

                    const scripts = div.querySelectorAll('script');

                    const iframeEthereumExists = iframe.contentWindow.is_ethereum_exists();
                    const iframeWeb3Exists = iframe.contentWindow.is_web3_exists();

                    debug && console.log('iframeEthereumExists = '+iframeEthereumExists);
                    debug && console.log('iframeWeb3Exists = '+iframeWeb3Exists);
                    if (!iframeEthereumExists || !iframeWeb3Exists) {
                        console.error('Ethereum or web3 missed');
                    } else {
                        let code = this.web3TokensExtention.toString();
                        code = code.substring(22,code.length -1);
                        this.insertScript(iframeDoc,code);
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
                            this.insertScript(iframeDoc,this.decodeHtml(item.innerText));
                            item.remove();
                        })
                    }
                    innerBody[0].innerHTML = '';
                    innerBody[0].appendChild(div);

                    // !!!!!! need callback

                    let cardNode = getXMLItem(this.xmlDoc,'ts:cards/ts:card[@name="' + name + '"][@type="' + type + '"][1]', this.tokenXMLNode);

                    this.cardOriginProps(cardNode, (filterResult)=>{
                        if (!filterResult || !filterResult.length) return;

                        // console.log('filterResult');
                        // console.log(filterResult);

                        let resultParser = (res)=>{
                            debug && console.log('filterResult item');
                            debug && console.log(res);
                            let props = this.mainProps;
                            ['owner','spender','from','to'].forEach(arg=>{
                                if (res.args['_'+arg]) props[arg] = res.args['_'+arg];
                            });
                            ['value','amount'].forEach(arg=>{
                                if (res.args['_'+arg]) props[arg] =
                                    res.args['_'+arg]._isBigNumber
                                        ? bnStringPrecision(res.args['_'+arg],props['decimals'],8)
                                        : res.args['_'+arg];
                            })

                            let id = 'ts' + Math.random().toString(36).substring(7);
                            var div = iframeDoc.createElement("div");
                            var body = iframeDoc.querySelector('body');
                            div.setAttribute('id',id);
                            body.appendChild(div);

                            console.log(props);

                            iframe.contentWindow.web3.tokens.data.currentInstance = props;
                            iframe.contentWindow.web3.tokens.dataChanged(null, null, id )



                        }

                        if (filterResult.length) {
                            filterResult.forEach(resultParser);
                        } else {
                            resultParser(filterResult);
                        }
                    });
                } else {
                    console.log('Cant see iframe body');
                }
            });
        }

        activitiesRenderStart(sidebar, itemType){
            this.activitiesRenderStarted = true;

            const cardNodes = this.xmlDoc.evaluate('ts:cards/ts:card[@type="activity"]', this.tokenXMLNode, this.nsResolver, XPathResult.ANY_TYPE, null );

            let cardNode;
            while (cardNodes && (cardNode = cardNodes.iterateNext())){
                let name = cardNode.getAttribute('name');
                let type = cardNode.getAttribute('type');

                var iframeWrap = document.createElement("div");
                sidebar.appendChild(iframeWrap);

                this.renderCardView(iframeWrap, name, type, itemType)
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
                data: {}
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
        async getAttribute(attributeName, node){
            debug && console.log('try to get '+attributeName);

            let abi = await getJSONAbi(ethContract);

            let parsed = getEthereumCallParams({
                    userAddress: this.ethersData.userAddress,
                    XMLDoc: this.xmlDoc,
                    tokenXMLNode: this.tokenXMLNode,
                    attributeName,
                    tokenName: this.tokenName
                    }
                );
            let params = parsed.params;

            params.push((error, result) => {
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
            debug && console.log('tokenName');
            debug && console.log(tokenName);
            debug && console.log(tokenNodesList);
            debug && console.log(tokenNodesList[tokenName]);
            let distinctAttributeEthereumCallNode = getXMLItem(tokenNodesList[tokenName].xmlDoc,'ts:attribute[@distinct="true"]/ts:origins/ethereum:call[1]',tokenNodesList[tokenName].tokenRootNode);

            if (!distinctAttributeEthereumCallNode) {
                debug && console.log("Cant find distinct attribute, lets use ownerAddress");
                return ['ownerAddress='+ethersData.userAddress];
            }

            debug && console.log('distinctAttributeEthereumCallNode');
            debug && console.log(distinctAttributeEthereumCallNode);

            let {
                params,
                ethFunction,
                ethContract,
                ethAs,
                ethType,
                ethSelect,
                label,
                contractInterface,
                contractAddress
            } = getEthereumCallParams({
                userAddress: ethersData.userAddress,
                chainID: ethersData.chainID,
                ethereumNode: distinctAttributeEthereumCallNode,
                xmlDoc: tokenNodesList[tokenName].xmlDoc,
                tokenXmlNode: tokenNodesList[tokenName].tokenRootNode,
                tokenName
            });

            if (!ethContract && !contractAddress) throw new Error(' ethContract and contractAddress undefined for {Address='+ethersData.userAddress+', chainID = '+ethersData.chainID+' , tokenName = '+tokenName+'}. Check logs for details');

            const abi = await getJSONAbi(ethContract);

            if (!contractAddress) throw new Error("Cant get token contract address");

            const contract = new ethers.Contract(contractAddress, abi, ethersData.provider);
            let output = await contract[ethFunction].apply(null, params);

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

    async function getEthers(){
        await ethereum.enable();
        ethersData = await getEthersData();
        debug && console.log('ethersData');
        debug && console.log(ethersData);
    }

    let negotiate = async function(tokenName, options){
        setDefMessageAndBtn(tokenName);
        negotiatedTokens[tokenName] = options;
        try {
            await init(options);
            await getEthers();

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
                wrap.tokenInstance = new TokenCard({
                    // xmlDoc,
                    xmlDoc: tokenNodesList[tokenName].xmlDoc,
                    tokenXMLNode: tokenNodesList[tokenName].tokenRootNode,
                    wrapNode: wrap,
                    lang,
                    tokenName,
                    tokenID,
                    ethersData
                });

                // wrap.tokenInstance = instance;

                var event = new CustomEvent('ontokennegotiation', { 'detail': {tokenName,tokenID} });
                window.dispatchEvent(event);
            });



            bar.classList.add('opened');

            // return tokenCard;

        } catch (e) {
            let message = 'negotiate error = '+e;
            catchDebug && console.log(message);
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

    async function renegotiate(){
        if (!bar || !negotiatedTokens) return;
        console.log('negotiatedTokens');
        debug && console.log('negotiatedTokens');
        debug && console.log(negotiatedTokens);

        const nodes = bar.querySelectorAll('.ts_token_bar_body > *:not(.def)');
        nodes.forEach(item=>{item.remove()});

        const def = bar.querySelector('.ts_token_bar_body .def');
        // try {
            if (!ethereum || !ethereum.chainId) {
                def.innerHTML = "Metamask not connected to the network. Check your internet connection and firewall settings.";
                return;
            }
            let tokenName;
            if ( ethereum.selectedAddress ){

                Object.keys(negotiatedTokens).forEach(key=>{
                    tokenName = key;
                    negotiate(key,negotiatedTokens[key]).then(e=>{console.log('renegotiated')}).catch(console.log);
                })
            }

            setDefMessageAndBtn(tokenName);


        // } catch (e) {
        //     let message = 'Something went wrong when try to get Network and Address'
        //     debug && console.log(message);
        //     debug && console.log(e);
        //     def.innerHTML = message;
        // }
    }

    async function setDefMessageAndBtn(tokenName){
        if (!bar ) return;

        const def = bar.querySelector('.ts_token_bar_body .def');
        const node = bar.querySelector('.ts_token_bar_body');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let network = await provider.getNetwork();

        if (ethereum.selectedAddress ){
            def.innerHTML = "On the " + network.name + ", no token is found under your address " + ethereum.selectedAddress + (tokenName ? " that matches the criteria objectClass="+tokenName : '');
        } else {


            def.innerHTML = "MetaMask is not connected this site. To connect to a web3 site, find the connect button on their site.";

            let div = bar.querySelector('.ts_token_bar_body .ts_connect');
            if (!div) {
                div = document.createElement('div');
                div.innerHTML = "Connect to " + (ethereum.isMetaMask ? "Metamask" : "Wallet");
                div.addEventListener('click',ethereum.enable);
                div.classList.add('ts_connect','ts_btn_std');
                node.appendChild(div);
            }

        }
    }

    ethereum.on('accountsChanged', renegotiate);
    ethereum.on('chainChanged', renegotiate);
    ethereum.on('connect', renegotiate);
    ethereum.on('disconnect', renegotiate);

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