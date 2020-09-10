window.Negotiator = (function(){
    let ready = false;
    let tokens = {};
    let select, bar, lang, xmlDoc, nsResolver;
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
    }

    let init = async function(options){
        // options from main page request
        if (ready) return;

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
            reject(new Error("Please load this App from HTTP/HTTPS server"));
        }
        lang = parseDocumentLang();
        lang = lang ? lang : config.lang;

        try {
            var res = await parseTokenXML();
        } catch (e) {
            console.log(e);
            return;
        }
        ready = true;
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
    Get TS token XML
     */
     let parseTokenXML = async function(){
        // console.log('inside parseTokenXML');
        const XMLNode = document.querySelector('link[rel="tokenscript"]');
        if (!XMLNode || !XMLNode.href) reject(new Error("Tokenscript link missed"));

        if (isTokenExpired()) reject(new Error("Token expired") );

        const XMLPath = XMLNode.href;

        // console.log('parseTokenXML XMLPath = ');
        // console.log(XMLPath);

        try {
            const response = await fetch(XMLPath);
            const xmlText = await response.text();
            xmlDoc = await (new window.DOMParser()).parseFromString(xmlText, "text/xml");
            nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);

        } catch (e) {
            console.error('Fetch XML Error.');
            console.error(e.message());
            return;
        }

         tokens = [];
         var tokenNodes = xmlDoc.evaluate('/ts:token', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
         let tokenNode = tokenNodes.iterateNext();

         while (tokenNode) {
             tokens.push(tokenNode.getAttribute('name'));
             tokenNode = tokenNodes.iterateNext();
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
        bar.innerHTML = '<div class="ts_token_bar_head"><div class="ts_token_bar_icon"></div><div class="ts_token_bar_title">Tokens List</div></div><div class="ts_token_bar_body"></div>';
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

        tokens.forEach(t=> html += '<div class="ts_token">' + t + '</div>' );
        html +='</div></div>';

        select.innerHTML = html;

        let tokenNodes = select.querySelectorAll('.ts_token');

        tokenNodes.forEach(node=>{
            node.addEventListener('click',e=>{
                // console.log(node.innerHTML);
                negotiate(node.innerHTML);
                select.classList.add('disabled');
            })
        })

        const closeNode = select.querySelector('.ts_close');
        if (closeNode) closeNode.addEventListener('click',e=>{select.classList.add('disabled')});


        return select;
    }

    class TokenCard {
        constructor(data) {
            console.log('TokenCard constructor fired');

            this.xmlDoc = data.xmlDoc;
            this.nsResolver = data.nsResolver;
            this.tokenName = data.tokenName;
            this.toRender = data.wrapNode;
            this.lang = data.lang;

            this.fallbackLang = 'en';
            this.ready = false;

            this.ContractJsonPath = 'contracts/';

            this.jsons = {};

            this.parseTokenData();
            this.render();
        }


        /*
        Parse Token specific data
         */
        parseTokenData(){
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
            // if (this.toRender) this.render(this.toRender);
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

        render(){
            console.log('render fired;');
            // this.toRender = container;
            if (!this.ready) {
                console.log('let render when object ready ... render defered.');
                return;
            }

            if (!this.toRender) {
                console.error('Container required');
                return;
            }

            if ("iframe" == this.toRender.tagName.toLowerCase()) {
                console.error('Container should not be iframe, use div instead');
                return;
            }

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

    let negotiate = async function(tokenName, options){
        try {
            await init(options);
            console.log('negotiate fired for '+tokenName)
            bar = bar ? bar : createFloatingBox();

            const thisToken = bar.querySelector('.ts_token_bar_body .ts_token_wrap[data-name="'+tokenName+'"]');

            bar.classList.add('opened');
            if (thisToken) {
                console.log('token already added');
            } else {
                let barBody = bar.querySelector('.ts_token_bar_body');
                let wrap = document.createElement('div');
                wrap.setAttribute('data-name',tokenName);
                wrap.classList.add('ts_token_wrap');
                barBody.appendChild(wrap);

                let tokenCard = new TokenCard({
                    xmlDoc,
                    wrapNode: wrap,
                    lang,
                    nsResolver,
                    tokenName
                });
                tokens[tokenName] = tokenCard;

                var event = new CustomEvent('ontokennegotiation', { 'detail': tokenName });
                window.dispatchEvent(event);

                return tokenCard;
            }
        } catch (e) {
            console.error(e);
        }


    }
    let getToken = function(name){
        if (!tokens[name]) {
            return negotiate(name);
        }
        return tokens[name];
    };
    let selectTokenFromList = function(options = {}){
        init(options).then(res=>{
            try {
                // console.log('init res');
                // console.log(res);

                console.log('init OK');
                if (tokens.length){

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
        negotiate(metaDefinedTokenName).then(e=>{bar.classList.remove('opened');});

    }

    return {
        negotiate,
        getToken,
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