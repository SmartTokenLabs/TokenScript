class TokenCard {
    constructor() {
        // UserAddress
        // console.log('constructor fired');

        this.ready = false;
        this.toRender = null;

        this.config = {
            // name for <meta name="token" content="xxx"/>
            tokenMeta: 'token.filter',
            // name for <meta name="token-expiry" content=">=2018-04-04"/>
            tokenExpireMeta: 'token-expiry',
            // fallback content for <meta name="token" content="ethereum:1/0x63cCEF733a093E5Bd773b41C96D3eCE361464942/"/>
            token: 'ethereum:1/0x63cCEF733a093E5Bd773b41C96D3eCE361464942/',
            // fallback lang
            lang: 'en',
            // not realized yet
            inject_web3: true,
            // "ts:item-view" or "ts:view"
            card_view: 'ts:item-view',
            // "<ts:card name="main" type="token">" or "<ts:card exclude="expired" name="enter" type="action">"
            card_name: 'main',
            card_type: 'action',
        }

        this.ContractJsonPath = 'contracts/';

        // if (!window.ethereum) {
        //     console.log('Ethereum Wallet doesnt work at this page, please enable it and reload page.');
        //     return;
        // }

        // if (!Web3) {
        //     cl("Please load Web3 library before this App");
        //     return;
        // }

        if (window.location.protocol == 'file:') {
            cl("Please load this App from HTTP/HTTPS server(local web server should work good), because of browser security reason you can't connect remote server from local file script.");
            return;
        }

        this.lang = this.parseDocumentLang();

        this.jsons = {};

        this.parseTokenXML().then( () => {
            this.parseTokenData();
            // this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        }).catch(e=>{
            console.log('XML parse error. '+e.message);
        });
    }
    /*
    Get Token Expire date and compare to today
     */
    isTokenExpired(){
        const TokenExpireMetaNode = document.querySelector('meta[name="'+this.config.tokenExpireMeta+'"]');
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

    /*
    Parse Token specific data
     */
    parseTokenData(tokenName = ''){
        this.tokenName = tokenName ? tokenName : this.getTokenName();

        this.tokenXMLNode = this.getXMLItem('/ts:token[@name="'+this.tokenName+'"][1]');
        const xpathNode = this.getXMLItem('ts:origins/ts:ethereum[@contract][1]',this.tokenXMLNode);

        // console.log(this.tokenXMLNode);

        if (xpathNode){
            this.defaultContract = xpathNode.getAttribute('contract');
        }

        let xmlNodeSet = this.xmlDoc.evaluate('ts:contract', this.tokenXMLNode, this.nsResolver, XPathResult.ANY_TYPE, null );
        let item = xmlNodeSet.iterateNext();

        this.contracts = {};
        do {
            let contract = item.getAttribute('name');
            let addressNodeSet = this.xmlDoc.evaluate('ts:address[1]', item, this.nsResolver, XPathResult.ANY_TYPE, null );
            let addressNode = addressNodeSet.iterateNext();
            this.contracts[contract] = addressNode.innerHTML;
            item = xmlNodeSet.iterateNext();
        } while (item);

        this.ready = true;
        console.log('this.toRender');
        console.log(this.toRender);
        if (this.toRender) this.render(this.toRender);
    }

    /*
    Use specific token and options
     */
    negotiate(tokenName,options = {}){
        this.parseTokenData(tokenName);
    }

    /*
    Get Token Name
     */
    getTokenName(){
        const TokenMetaNode = document.querySelector('meta[name="'+this.config.tokenMeta+'"]');
        const content = (TokenMetaNode && TokenMetaNode.content) ? TokenMetaNode.content : '';
        const filter = content.match(/objectClass=(\S+)/);

        return filter[1] ? filter[1] : this.config.token;
    }

    /*
    Get TS token XML
     */
    async parseTokenXML(){
        const XMLNode = document.querySelector('link[rel="tokenscript"]');
        if (!XMLNode || !XMLNode.href) throw new Error("Tokenscript link missed");

        if (this.isTokenExpired()) throw new Error("Token expired");

        const XMLPath = XMLNode.href;

        try {
            const response = await fetch(XMLPath);
            this.xmlText = await response.text();
            this.xmlDoc = await (new window.DOMParser()).parseFromString(this.xmlText, "text/xml");
            this.nsResolver = this.xmlDoc.createNSResolver( this.xmlDoc.ownerDocument == null ? this.xmlDoc.documentElement : this.xmlDoc.ownerDocument.documentElement);

        } catch (e) {
            console.error('Fetch XML Error.');
            console.error(e.message());
            return;
        }

        // let entitiesRegEx = /<\!DOCTYPE\s+token\s+\[\s+([^\]]+)\s+\]>/;
        // let entities = this.xmlText.match(entitiesRegEx);
        //
        // let entityRegEx = /<\!ENTITY\s+(\S+)\s+SYSTEM\s+"([^"]+)"\s{0,}>/;
        // let entityArr = entities[1].match(new RegExp(entityRegEx.source, entityRegEx.flags + "g"));
        //
        // this.files = {};
        // entityArr.forEach(item=>{
        //     let entity = item.match(entityRegEx);
        //     if (entity[1]) {
        //         this.files[entity[1]] = entity[2];
        //         this.xmlText = this.xmlText.split('&'+entity[1]+';').join('%%%'+entity[1]+';')
        //     }
        // });


    }
    /*
    Get document lang
     */
    parseDocumentLang(){
        const HTMLNode = document.querySelector('html');
        let lang;

        if (!HTMLNode) {
            console.error('HTML attribute missed, fallback to english');
        } else {
            lang = HTMLNode.getAttribute('lang');
        }
        return lang ? lang : this.config.lang;
    }
    /*
    Parse token labels
     */
    parseTokenLabels(){

    }
    /*
    Inject helper JS code
     */
    injectIframeContent(){
        let code = this.iframeHelper.toString();
        code = code.substring(15,code.length -1);
        this.insertScript(this.iframeDoc,code);
    }

    render(container){
        console.log('render fired;');
        this.toRender = container;
        if (!this.ready) {
            console.log('let render when object ready ... render defered.');
            return;
        }

        if (!container) {
            console.error('Container required');
            return;
        }

        if ("iframe" == container.tagName.toLowerCase()) {
            console.error('Container should not be iframe, use div instead');
            return;
        }

        container.innerHTML = '';

        this.iframe = container.ownerDocument.createElement('iframe');
        this.iframe.src = "blank.html";
        container.appendChild(this.iframe);

        return new Promise(resolve => {
            this.iframe.onload = () => {

                this.iframeDoc = this.iframe.contentDocument? this.iframe.contentDocument: this.iframe.contentWindow.document;
                this.iframe.contentWindow.onerror = e=>{console.log('iframe error'); console.log(e);};
                this.injectIframeContent();
                this.runParser();
                resolve();
            }
        })

    }


    runParser(accounts){
        console.log('runParser started');
        // this.account = accounts[0];


        // this.cardHtml = this.getXMLItemText( 'ts:cards/ts:card[@type="token"]/ts:view[@xml:lang="' + this.lang + '"][1]', this.tokenXMLNode );
        // this.cardHtml = this.cardHtml ? this.cardHtml : this.getXMLItemText('ts:cards/ts:card[@type="token"]/ts:view[@xml:lang="' + this.fallbackLang + '"][1]', this.tokenXMLNode );

        this.cardHtml = this.getXMLItemText( 'ts:cards/ts:card[@type="token"]/ts:item-view[@xml:lang="' + this.lang + '"][1]', this.tokenXMLNode );
        this.cardHtml = this.cardHtml ? this.cardHtml : this.getXMLItemText('ts:cards/ts:card[@type="token"]/ts:item-view[@xml:lang="' + this.fallbackLang + '"][1]', this.tokenXMLNode );

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

            console.log('iframeEthereumExists = '+iframeEthereumExists);
            console.log('iframeWeb3Exists = '+iframeWeb3Exists);
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
    parse XML and return innerHTML value by selector (XPath)
     */
    getXMLItemText(selector, context = ''){
        var item = this.getXMLItem(selector, context);
        if (item) {
            return item.innerHTML;
        } else {
            console.log(selector);
            console.log('Cant find value');
        }
    }

    /*
    parse XML and return innerHTML value by selector (XPath)
     */
    getXMLItem(selector, context = '' ){
        var xmlNode = this.xmlDoc.evaluate(selector, context?context:this.xmlDoc, this.nsResolver, XPathResult.ANY_TYPE, null );
        return xmlNode.iterateNext();
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
    async parseAttribute(func, node){
        console.log('try to parse '+func);
        let xpathNode = this.getXMLItem('/ts:token/ts:attribute[@name="'+func+'"][1]' );
        // let xpathNode = xmlNodeSet.iterateNext();
        if (xpathNode){
            let xmlNode = this.getXMLItem('ts:label/ts:string[@xml:lang="'+this.lang+'"][1]',xpathNode);
            let label = xmlNode.innerHTML;
            if (!label) {
                let labelNode = this.getXMLItem('ts:label/ts:string[@xml:lang="'+this.fallbacklang+'"][1]',xpathNode);
                label = labelNode.innerHTML;
            }

            xmlNode = this.getXMLItem('ts:origins/ethereum:call[1]',xpathNode);
            // console.log(xpathNode);
            // console.log(xmlNode);
            let ethFunction = xmlNode.getAttribute('function');
            let ethContract = xmlNode.getAttribute('contract');

            // console.log('ethFunction defined');
            // console.log(ethFunction);
            ethContract = ethContract ? ethContract : this.defaultContract;
            let abi = await this.getJSONAbi(ethContract);
            console.log(abi);

            let ethAs = xmlNode.getAttribute('as');
            let ethType = xmlNode.getAttribute('type');
            let ethSelect = xmlNode.getAttribute('select');

            let xmlNodeSet = this.xmlDoc.evaluate('ts:origins/ethereum:call/ts:data/*', xpathNode, this.nsResolver, XPathResult.ANY_TYPE, null );

            let item = xmlNodeSet.iterateNext();
            let params = [];
            do {
                let ref = item.getAttribute('ref');
                if ('ownerAddress' == ref) {
                    params.push(this.input.UserAddress);
                } else {
                    params.push(item.innerHTML);
                }
                item = xmlNodeSet.iterateNext();
            } while (item);

            let domNode = node.querySelector('[data-eth-type="label"]');
            if (domNode) domNode.innerHTML = label;

            // console.log(params);

            params.push((error, result) => {
                console.log("result and error");
                console.log(result);
                console.log(error);
                if (!error) {
                    window.res = result;

                    let domNode = node.querySelector('[data-eth-type="value"]');
                    let resultStr;

                    resultStr = result.length ? this.extractresultValue(ethFunction, result, ethSelect,this.jsons[ethContract].abi) : result.toNumber();

                    if (domNode) {
                        domNode.innerHTML = resultStr;
                    }

                    console.log(result);
                } else
                    console.error(error);
            });

            this.runContractMethod(ethContract, ethFunction, params);

        } else {
            console.log('cant find attribute label');
        }

    }

    /*
    Read JSON
     */
    async getJSONAbi(ethContract){
        let contractJson = this.jsons[ethContract];
        if (!contractJson) {
            let response = await fetch(this.ContractJsonPath + ethContract + '.json');
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            contractJson = await response.json();
            this.jsons[ethContract] = contractJson;
        }
        return contractJson.abi;
    }

    /*
    send contract request
     */
    runContractMethod(ethContract, func, params){
        const contract = web3.eth.contract(this.jsons[ethContract].abi).at(this.contracts[ethContract]);
        console.log(contract);
        console.log(params);
        console.log(contract[func]);

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
                        console.log('parameter found');
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
// window.token = {TokenCard};

// window.Negotiator = {
//     negotiate: TokenCard.negotiate
// }


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