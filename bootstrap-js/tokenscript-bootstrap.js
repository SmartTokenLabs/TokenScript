import {to, compareStringToProps, getEthersData, isTokenExpired, getContractAddress, getXMLItemText, getXMLItem, getJSONAbi, filterResultConverter, bnStringPrecision, getEthereumCallParams} from './modules/ts_helpers.js';

window.Negotiator = (function(){
    let tsDebug = true;
    tsDebug = false;

    let catchDebug = true;
    catchDebug = false;

    let ready = false;
    let tokenNodesList = {};
    let bar, lang, ethersData;
    let web3;
    let jsons = {};
    let config = {
        // name for <meta name="token" content="xxx"/>
        tokenMeta: 'token.filter',
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


    async function init(){
        if (ready) return;
        try {
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
            bar = createFloatingBox();

            ready = true;
        } catch (e) {
            let message = ' ;init error happened -> ' + e;
            catchDebug && console.log(message);
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

    /**
     * Parse HTML for tokenscripts and fire parse files
     * @param debug
     * @returns {Promise<void>}
     */
    async function parseXML(debug = false){
        const XMLNodes = document.querySelectorAll('link[rel="tokenscript"]');

        if (XMLNodes) for (let i=0; i < XMLNodes.length; i++){
            const XMLPath = XMLNodes[i].href;
            try {
                const response = await fetch(XMLPath);
                const xmlText = await response.text();
                await parseXMLFromText(xmlText);
            } catch (e) {
                let message = ' Fetch XML Error. '+e;
                debug && console.log(message);
                debug && console.log(e);
                throw new Error(message);
            }
        }
    }

    /**
     * Parse XML files and fill tokenNodesList
     * @param xmlText
     * @returns {Promise<*|string>}
     */
    async function parseXMLFromText(xmlText){
        let xmlDoc = await (new window.DOMParser()).parseFromString(xmlText, "text/xml");

        let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
        let tokenNodes = xmlDoc.evaluate('/ts:token', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
        let tokenNode;
        if (tokenNode = tokenNodes.iterateNext()) {
            tokenNodesList[tokenNode.getAttribute('name')] = {
                tokenRootNode: tokenNode,
                xmlDoc: xmlDoc,
                filter: ''
            };
        }
        return tokenNode.getAttribute('name');

        // while (tokenNode) {
        //     tokenNodesList[tokenNode.getAttribute('name')] = {
        //         tokenRootNode: tokenNode,
        //         xmlDoc: xmlDoc
        //     };
        //     tokenNode = tokenNodes.iterateNext();
        // }
    }

    function createFloatingBox(){
        let bar = document.querySelector('.ts_token_bar');
        if (bar) return bar;

        bar = document.createElement('div');
        bar.classList.add('ts_token_bar');
        bar.innerHTML = '<div class="ts_token_bar_head"><div class="ts_token_bar_icon"></div><div class="ts_token_bar_title">Tokens List</div></div><div class="ts_token_bar_body"><div class="notokens"></div></div>';
        const body = document.getElementsByTagName('body');
        body[0].appendChild(bar);
        const head = bar.querySelector('.ts_token_bar_head');
        head.addEventListener('click',e=>{
            bar.classList.toggle('opened');
            e.preventDefault();
            // return false;
        });

        return bar;
    }

    /*
    let createSelectOverlay = function(filter){
        let body = document.getElementsByTagName('body');
        let select = document.getElementById('ts_select_token');
        if (!select){
            select = document.createElement('div');
            select.setAttribute('id','ts_select_token');
            body[0].appendChild(select);
        }


        let html = '<div class="ts_select_box"><div class="ts_close"></div><h2>Select Token</h2><div class="ts_token_list">';

        Object.keys(tokenNodesList).forEach(t=> html += '<div class="ts_token">' + t + '</div>' );
        html +='</div></div>';

        select.innerHTML = html;

        let tokenNodes = select.querySelectorAll('.ts_token');

        tokenNodes.forEach(node=>{
            node.addEventListener('click',async e=>{
                // console.log(node.innerHTML);
                try {
                    await negotiate(node.innerHTML,filter).then(console.log);

                } catch (e) {
                    let message = 'on select. negotiate error = '+e;
                    tsDebug && console.log(message);
                    console.log(e);
                }
                select.classList.add('disabled');

            })
        })

        const closeNode = select.querySelector('.ts_close');
        if (closeNode) closeNode.addEventListener('click',e=>{select.classList.add('disabled')});


        return select;
    }
    */


    class TokenCard {
        constructor(data) {
            this.xmlDoc = data.xmlDoc;
            this.tokenXMLNode = data.tokenXMLNode;
            this.tokenName = data.tokenName;
            this.tokenID = data.tokenID;
            this.distinctName = data.distinctName;
            this.toRender = data.wrapNode;
            this.lang = data.lang;
            this.ethersData = data.ethersData;
            this.filter = data.filter;
            this.activitiesRenderStarted = false;

            this.cardName = data.cardName ? data.cardName : 'main';
            this.cardType = data.cardType ? data.cardType : "token";
            this.viewType = data.viewType ? data.viewType : 'item-view';
            // this.viewType = data.viewType ? data.viewType : 'view';

            this.fallbackLang = 'en';
            this.ready = false;

            this.debug = data.debug;

            this.nsResolver = this.xmlDoc.createNSResolver( this.xmlDoc.ownerDocument == null ? this.xmlDoc.documentElement : this.xmlDoc.ownerDocument.documentElement);

            let xmlNode = getXMLItem(this.xmlDoc,'ts:origins/ts:ethereum[1]', this.xmlDoc);
            this.defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';
            this.defaultContract = this.defaultContract ? this.defaultContract : this.tokenName;

        }

        async getDistinctItems(){
            let props = await this.getProps();
            this.debug && console.log('props received');
            this.debug && console.log(props);

            let distinctAttributeNode = getXMLItem(this.xmlDoc, 'ts:attribute[@distinct="true"][1]', this.tokenXMLNode);

            if (!distinctAttributeNode) {
                this.debug && console.log("Cant find distinct attribute, lets use ownerAddress");
                return {
                    distinctName: "ownerAddress",
                    items: [this.ethersData.userAddress]
                };
            } else {
                let distinctAttributeEthereumCallNode = getXMLItem(this.xmlDoc, 'ts:origins/ethereum:call[1]', distinctAttributeNode);

                if (!distinctAttributeEthereumCallNode) {
                    this.debug && console.log("Cant find distinct attribute Ethereum Call, lets use ownerAddress");
                    // return ['ownerAddress='+ethersData.userAddress];
                    return {
                        distinctName: "ownerAddress",
                        items: [this.ethersData.userAddress]
                    };
                }

                const distinctName = distinctAttributeNode.getAttribute('name');
                let items = [];

                if (props[distinctName] && props[distinctName].length) {
                    props[distinctName].forEach(a => {
                        items.push(a._isBigNumber ? a.toHexString() : a.toString())
                    });
                } else {
                    this.debug && console.log('Empty token list');
                }

                return {
                    distinctName,
                    items
                };
            }
        }

        async getAllProps(props = false, cardName = '', cardType = ''){

            cardName = cardName ? cardName : this.cardName;
            cardType = cardType ? cardType : this.cardType;

            // console.log('try to get props');
            props = props ? props : await this.getProps();
            this.debug && console.log('props received');
            this.debug && console.log(props);

            // get card-view html
            let selector = 'ts:cards/ts:card[@name="' + cardName + '"][@type="' + cardType + '"][1]';
            let cardNode = getXMLItem(this.xmlDoc, selector, this.tokenXMLNode );

            if (!cardNode) {
                this.debug && console.log('cant see card for >>>'+selector+'<<<');
                // if (cardName =='main' && cardType =="token" ) this.cardHtml = '<h2 style="text-transform: uppercase;">' + this.tokenName + '</h2>';
                return [props];
            }


            // let cardHtmlNode = getXMLItem(
            //     this.xmlDoc,
            //     'ts:'+this.viewType+'[@xml:lang="' + this.lang + '"][1]',
            //     cardNode,
            //     'ts:'+this.viewType+'[@xml:lang="' + this.fallbackLang + '"][1]' );
            //
            // this.cardHtml = cardHtmlNode ? cardHtmlNode.innerHTML : '';

            // if (!this.cardHtml && this.cardName!='main' && this.cardType!="token" ) {
            //     this.debug && console.log('cant see "'+this.viewType+'" node for name ="'+this.cardName+'" and type = "'+this.cardType + '";' );
            //     return [props];
            // }

            selector = 'ts:origins/ethereum:event';
            let originsNodes = this.xmlDoc.evaluate(selector, cardNode, this.nsResolver, XPathResult.ANY_TYPE, null );

            var out = [];
            let ethereumEventNode;
            while (originsNodes && (ethereumEventNode = originsNodes.iterateNext() ) ) {

                this.debug && console.log('ethereumEventNode');
                this.debug && console.log(ethereumEventNode);
                // ------------------------
                // ethereum:event
                var eventFilter = ethereumEventNode.getAttribute('filter');
                var eventType = ethereumEventNode.getAttribute('type');
                var ethContract = ethereumEventNode.getAttribute('contract');
                ethContract = ethContract? ethContract: this.defaultContract;

                var { contractInterface, contractAddress } = getContractAddress(this.xmlDoc, ethContract, this.tokenXMLNode, this.ethersData.chainID);

                if (!contractAddress) {
                    this.debug && console.log('Contract address required. chainID = '+this.ethersData.chainID);
                    throw new Error('Contract address required. chainID = '+this.ethersData.chainID);
                }

                if (!ethContract && !contractAddress) throw new Error(' ethContract and contractAddress required for {Address='+this.ethersData.userAddress+', chainID = '+this.ethersData.chainID+' , tokenName = '+this.tokenName+'}. Check logs for details');

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

                this.debug && console.log('eventType');
                this.debug && console.log(eventType);

                this.debug && console.log('params');
                this.debug && console.log(params);

                // let abi = await getJSONAbi(ethContract);
                const [error, abi] = await to(getJSONAbi(ethContract, jsons, config.contractJsonPath, tsDebug));
                if (error) throw new Error(error);
                if (!abi) throw new Error('Empty ABI for '+ethContract);
                jsons[ethContract] = abi;

                const contract = new ethers.Contract(contractAddress, abi, this.ethersData.provider);

                let filter = contract.filters[eventType].apply(null, paramsArray);

                this.debug && console.log('filter');
                this.debug && console.log(filter);

                // contract.queryFilter(filter).then(this.cb(eventType + ' where ' + eventFilter));
                let [contractError, filterResult] = await to(contract.queryFilter(filter) );

                if (contractError) throw new Error('Error when try to request '+eventType+':  '+contractError);


                if (filterResult && filterResult.length){

                        // let id = 'ts' + Math.random().toString(36).substring(7);
                        // var div = iframeDoc.createElement("div");
                        // var body = iframeDoc.querySelector('body');
                        // div.setAttribute('id',id);
                        // body.appendChild(div);

                        // console.log(props);

                        // iframe.contentWindow.web3.tokens.data.currentInstance = props;
                        // iframe.contentWindow.web3.tokens.dataChanged(null, null, id )


                    if (filterResult.length) {
                        filterResult.forEach(res=>out.push( filterResultConverter( res, props) ) );
                    } else {
                        out.push( filterResultConverter(filterResult,props) );
                    }

                } else out.push(props);

            }

            if(!out.length) {
                let filterResult = compareStringToProps(this.filter, props);
                if (filterResult < 0) {
                    console.log('incorrect filter');
                    // this.toRender.style.display = "none";
                    return;
                } else if (!filterResult) {
                    console.log('filter not passed');
                    // this.toRender.style.display = "none";
                    return;
                }

                out.push(props);
            }

            return out;

        }

        async getProps(){
            try {
                ethersData = await getEthersData();

                const attributeXmlNodes = this.xmlDoc.evaluate('ts:attribute', this.tokenXMLNode, this.nsResolver, XPathResult.ANY_TYPE, null );

                var props = {};
                let attributeNode;

                while (attributeXmlNodes && (attributeNode = attributeXmlNodes.iterateNext() ) ) {
                    let name = attributeNode.getAttribute('name');

                    let originsInnerNode = getXMLItem(this.xmlDoc ,'ts:origins/*[1]',attributeNode);
                    if (!originsInnerNode) continue;

                    let dataNodeName = originsInnerNode.nodeName;
                    let res;

                    // this.debug && console.log(dataNodeName);

                    switch (dataNodeName) {
                        case 'ts:token-id':
                            // res = "542b33000000000000000000000001075b2282";
                            res = this.tokenID;

                            tsDebug && console.log('its ts:token-id, just use tokenID ');
                            break;
                        case "ethereum:call":
                            // this.debug && console.log('its ethereum call start');
                            let {
                                params,
                                ethCallAttributtes,
                                contract,
                                missedAttribute
                            } = getEthereumCallParams({
                                userAddress: this.ethersData.userAddress,
                                chainID: this.ethersData.chainID,
                                ethereumNode: originsInnerNode,
                                xmlDoc: this.xmlDoc,
                                tokenXmlNode: this.tokenXMLNode,
                                tokenName: this.tokenName,
                                tokenId: this.tokenID,
                                debug: this.debug,
                            });

                            if ( (!ethCallAttributtes || !ethCallAttributtes.contract) && (!contract && !contract.contractAddress) ) throw new Error(' ethContract and contractAddress required for {Address='+this.ethersData.userAddress+', chainID = '+this.ethersData.chainID+' , tokenName = '+this.tokenName+'}. Check logs for details');

                            if (missedAttribute) {
                                this.debug && console.log('missed attribute: "' + missedAttribute + '", ethereum call skipped');
                                break;
                            }

                            const [abi_error, abi] = await to( getJSONAbi(ethCallAttributtes.contract,jsons,config.contractJsonPath, tsDebug ) );

                            if (!abi) {
                                console.error('Cant get Contract ABI for "'+ ethCallAttributtes.contract +'" , attribute "' + name + '" skipped');
                                throw new Error('Empty ABI for '+ethCallAttributtes.contract);
                            }
                            if (abi_error) throw new Error(abi_error);

                            jsons[ethCallAttributtes.contract] = abi;


                            const ethersContract = new ethers.Contract(contract.contractAddress, abi, this.ethersData.provider);
                            this.debug && console.log('ethFunction = ' + ethCallAttributtes.contract + '; name = '+name + '; params = '  );
                            this.debug && console.log(params);
                            let [error,output] = await to(ethersContract[ethCallAttributtes.function].apply(null, params) );
                            if (error) {
                                console.error('error while try to get attribute "'+name+'" value');
                            } else {
                                this.debug && console.log('correct output for "'+name+'"');
                                this.debug && console.log(output);
                                // let res = output._isBigNumber ? bnStringPrecision(output,18,8) : output;
                                res = output._isBigNumber ? output.toString() : output;
                            }

                            break;
                        // case "ethereum:call":
                        default:
                            this.debug && console.log('skipped, type not described. ');
                    }
                    // this.debug && console.log('property "'+name+'" has value "'+res+'"');
                    if (res) props[name] = res;
                }

                // let res = output._isBigNumber ? bnStringPrecision(output,18,8) : output;
                if (props['decimals'] && props['ownerBalance']) {
                    props['ownerBalance'] = bnStringPrecision(props['ownerBalance'],props['decimals'],8)
                }
                console.log('props:');
                console.log(props);
            } catch (e) {
                let message = "getProps() error. "+e;
                this.debug && console.log(e);
                this.debug && console.log(message);
                throw new Error(message);
            }
            return props;
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



        async render(wrapper, props, cardName = '', cardType = '', cardView = ''){
            // console.log('render ' +cardName+ ' ' +cardType+ '' + cardView);

            cardName = cardName ? cardName : this.cardName;
            cardType = cardType ? cardType : this.cardType;
            cardView = cardView ? cardView : this.viewType;

            // console.log('render ' +cardName+ ' ' +cardType+ '' + cardView);

            let cardHtml = '';

            // get card-view html
            let selector = 'ts:cards/ts:card[@name="' + cardName + '"][@type="' + cardType + '"][1]';
            let cardNode = getXMLItem(this.xmlDoc, selector, this.tokenXMLNode );
            if (!cardNode) {
                this.debug && console.log('cant see card for >>>'+selector+'<<<');
                if (cardName =='main' && cardType =="token" ) cardHtml = '<h2 style="text-transform: uppercase;">' + this.tokenName + '</h2>';
            } else {
                let cardHtmlNode = getXMLItem(
                    this.xmlDoc,
                    'ts:'+cardView+'[@xml:lang="' + this.lang + '"][1]',
                    cardNode,
                    'ts:'+cardView+'[@xml:lang="' + this.fallbackLang + '"][1]' );

                cardHtml = cardHtmlNode ? cardHtmlNode.innerHTML : '';

                this.debug && console.log('renderCardView started for name=' + cardName + '; type = ' + cardType + '; itemType=' + cardView);

                // console.log('cardHtml');
                // console.log(cardHtml);
            }




            // create wrapper for token instance iframe
            const iframeWrap = document.createElement('div');
            iframeWrap.setAttribute('data-tokenid',this.tokenID);
            iframeWrap.setAttribute('data-distinct-name',this.distinctName);
            iframeWrap.classList.add('ts_tokenitem_wrap');
            wrapper.appendChild(iframeWrap);

            let activityNode = getXMLItem(this.xmlDoc,'ts:cards/ts:card[@type="activity"][1]', this.tokenXMLNode);

            if (cardName=='main' && cardType=="token" && activityNode) {
                const sidebarToggle = document.createElement('div');
                sidebarToggle.classList.add('sidebar_toggle');
                sidebarToggle.innerHTML = ' &lt; Show Activities';
                wrapper.appendChild(sidebarToggle);

                const sidebar = document.createElement('div');
                sidebar.classList.add('activity_cards');
                wrapper.appendChild(sidebar);

                const cardNodes = this.xmlDoc.evaluate('ts:cards/ts:card[@type="activity"]', this.tokenXMLNode, this.nsResolver, XPathResult.ANY_TYPE, null );

                // console.log('cardNodes');
                // console.log(cardNodes);

                let cardNode;
                while (cardNodes && (cardNode = cardNodes.iterateNext())){
                    // console.log('cardNode');
                    // console.log(cardNode);

                    let activityName = cardNode.getAttribute('name');
                    let activityType = cardNode.getAttribute('type');



                    var sidebarIframeWrap = document.createElement("div");
                    sidebarIframeWrap.setAttribute('data-name', activityName);
                    sidebarIframeWrap.setAttribute('data-type', activityType);
                    sidebar.appendChild(sidebarIframeWrap);

                    let title = document.createElement("h3");
                    sidebarIframeWrap.appendChild(title);

                    let allProps = await this.getAllProps(props,activityName,activityType);
                    console.log('allProps for '+activityName + ' , ' + activityType);
                    console.log(allProps);



                    if (allProps && allProps.length) {
                        title.innerHTML = 'Events "'+activityName + ' + ' + activityType + '":';
                        allProps.forEach(p=>{
                            this.render(sidebarIframeWrap, p, activityName, activityType, this.viewType);
                        })
                    } else {
                        title.innerHTML = 'No Events "'+activityName + ' + ' + activityType + '"';
                    }

                }

                sidebarToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('opened');
                })
            }

            let iframe = iframeWrap.ownerDocument.createElement('iframe');
            // iframe.classList.add('')

            iframe.src = "blank.html";
            iframe.onload = () => {
                // let iframeWindow = iframe || iframe.contentWindow;
                // iframeWindow.addEventListener('load', () => {

                this.debug && console.log('iframe.onload fired;');
                iframe.contentWindow.onerror = e=>{console.log('iframe error'); console.log(e);};

                let iframeDoc = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;

                /* Inject helper JS code */
                let code = this.iframeHelper.toString();
                code = code.substring(15,code.length -1);
                this.insertScript(iframeDoc,code);

                const innerBody = iframeDoc.getElementsByTagName('body');

                if (!innerBody) {
                    console.log('Cant see iframe body tag');
                    return;
                }

                // const origin = document.defaultView.location.origin;


                let html = cardHtml ? this.replace_all(cardHtml,'<body>','') :'';
                html = this.replace_all(html,'</body>','');

                let div = iframeDoc.createElement('div');
                div.setAttribute('class','main');
                div.innerHTML = this.decodeHtml(html);
                const scripts = div.querySelectorAll('script');

                // test iframe ethereum and web3
                const iframeEthereumExists = iframe.contentWindow.is_ethereum_exists();
                const iframeWeb3Exists = iframe.contentWindow.is_web3_exists();
                this.debug && console.log('iframeEthereumExists = '+iframeEthereumExists);
                this.debug && console.log('iframeWeb3Exists = '+iframeWeb3Exists);
                if (!iframeEthereumExists || !iframeWeb3Exists) {
                    console.error('Ethereum or web3 missed');
                } else {
                    // inject helper code to fix web3.tokens.dataChanged and other errors
                    let code = this.web3TokensExtention.toString();
                    code = code.substring(22,code.length -1);
                    this.insertScript(iframeDoc,code);
                }

                // insert all scripts from card-view
                if (scripts.length){
                    scripts.forEach(item=>{
                        // let data = {
                        //     action:'inject_script',
                        //     content: this.decodeHtml(item.innerText)
                        // };
                        // iframe.contentWindow.postMessage(JSON.stringify(data),origin);
                        // console.log(item.innerText);
                        // this.insertScript(iframeDoc,this.decodeHtml(item.innerText));
                        this.insertScript(iframeDoc,item.innerText);
                        item.remove();
                    })
                }

                // clean body code and add card-view html(without scripts)
                innerBody[0].innerHTML = '';
                innerBody[0].appendChild(div);

                let id = 'ts' + Math.random().toString(36).substring(7);
                div = iframeDoc.createElement("div");
                var main = iframeDoc.querySelector('body .main');
                div.setAttribute('id',id);
                div.setAttribute('class','');
                main.appendChild(div);

                console.log(props);

                if (iframe.contentWindow.web3.tokens.dataChanged){
                    iframe.contentWindow.web3.tokens.data.currentInstance = props;
                    iframe.contentWindow.web3.tokens.dataChanged(null, {currentInstance: props}, id );
                }


                iframeDoc.dispatchEvent(new Event("DOMContentLoaded", {
                    bubbles: true,
                    cancelable: true
                }));
                // setTimeout(()=>{
                //     console.log('iframe.dispatchEvent(new Event("load"');
                //     iframe.contentWindow.onload();
                //     // iframe.dispatchEvent(new Event("load", {
                //     //     bubbles: true,
                //     //     cancelable: true
                //     // }));
                // }, 500);

            };
            iframeWrap.appendChild(iframe);

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
            // console.log('iframeHelper works');
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
        send contract request
         */
        runContractMethod(ethContract, func, params){
            const contract = web3.eth.contract(jsons[ethContract].abi).at(this.contracts[ethContract]);
            tsDebug && console.log(contract);
            tsDebug && console.log(params);
            tsDebug && console.log(contract[func]);

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
                            tsDebug && console.log('parameter found');
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

    /**
     * Add token to the list
     *
     * @param tokenName
     * @param filter
     * @param debug
     * @returns {Promise<void>}
     */
    async function negotiate(tokenName, filter, debug){

        // negotiatedTokens[tokenName] = filter;
        if (!tokenNodesList[tokenName]) {
            console.error('unknown token '+tokenName);
            return;
        }

        console.log('negotiate token '+tokenName+ ' with filter : '+filter);

        tokenNodesList[tokenName].filter = filter;

        try {
            await init();
            ethersData = await getEthersData();

            debug && console.log('negotiate fired for '+tokenName);

            const tokenNodes = bar.querySelectorAll('.ts_token_bar_body .ts_token_wrap[data-tokenname="'+tokenName+'"]');
            if (tokenNodes.length) tokenNodes.forEach(node=>node.remove());

            let initialTokenInstance = new TokenCard({
                // xmlDoc,
                xmlDoc: tokenNodesList[tokenName].xmlDoc,
                tokenXMLNode: tokenNodesList[tokenName].tokenRootNode,
                lang,
                fallbackLang: config.lang,
                tokenName,
                ethersData,
                filter,
                // debug: 1
            });
            let distinctProps = await initialTokenInstance.getDistinctItems();
            // console.log('distinctProps');
            // console.log(distinctProps);

            if (distinctProps && distinctProps.items && distinctProps.items.length) {
                distinctProps.items.forEach(tokenID => {
                    let tokenInstance = new TokenCard({
                        xmlDoc: tokenNodesList[tokenName].xmlDoc,
                        tokenXMLNode: tokenNodesList[tokenName].tokenRootNode,
                        lang,
                        fallbackLang: config.lang,
                        tokenName,
                        ethersData,
                        filter,
                        tokenID,
                        distinctName: distinctProps.distinctName,
                        // debug: 1
                    });
                    tokenInstance.getAllProps().then(rootProps => {
                        // console.log('rootProps');
                        // console.log(rootProps);
                        // if (rootProps && rootProps.length) rootProps.forEach()

                        let compareRes = compareStringToProps(filter,rootProps[0]);
                        // console.log('compareRes');
                        // console.log(compareRes);
                        if (!compareRes) {
                            setDefMessageAndBtn(filter);
                            return;
                        }

                        const barBody = bar.querySelector('.ts_token_bar_body');
                        let wrap = barBody.querySelector('.ts_token_wrap[data-tokenname="' + tokenName + '"]');
                        if (!wrap) {
                            wrap = document.createElement('div');
                            wrap.setAttribute('data-tokenname', tokenName);
                            wrap.classList.add('ts_token_wrap');
                            barBody.appendChild(wrap);
                        }
                        const def = bar.querySelector('.ts_token_bar_body .notokens');
                        if (def) def.innerHTML = '';

                        // render token main view
                        tokenInstance.render(wrap, rootProps[0]).then(() => {
                            setDefMessageAndBtn(filter);
                        });
                        wrap.instance = tokenInstance;

                        var event = new CustomEvent('ontokennegotiation', {'detail': {tokenName, tokenID}});
                        window.dispatchEvent(event);

                    });


                });
            } else {
                setDefMessageAndBtn(filter);
            }

            bar.classList.add('opened');

        } catch (e) {
            let message = 'negotiate error = '+e;
            debug && console.log(message);
            debug && console.log(e);
            throw new Error(message);
        }
    }

    const metaDefinedTokenName =  getTokenName();
    if (metaDefinedTokenName){
        try {
            negotiate(metaDefinedTokenName).then(e=>{bar.classList.remove('opened');});
        } catch (e) {
            let message = 'negotiate error = '+e;
            catchDebug && console.error(message);
            console.error(e);
        }
    }

    async function renegotiateAll(filter = ''){
        console.log('renegotiateAll fired. filter = '+filter);
        await init();


        if (!bar || !tokenNodesList) return;

        // const nodes = bar.querySelectorAll('.ts_token_bar_body > *:not(.notokens)');
        // nodes.forEach(item=>{item.remove()});

        let tokens = Object.keys(tokenNodesList);
        tokens.forEach(async tokenName=> await negotiate(tokenName,filter))
    }

    async function passiveRenegotiateAll(){
        await init();

        if (!bar || !tokenNodesList) return;
        let tokens = Object.keys(tokenNodesList);
        tokens.forEach(tokenName=>negotiate(tokenName,tokenNodesList[tokenName].filter))
    }

    async function setDefMessageAndBtn(filter = ''){
        if (!bar ) return;

        const def = bar.querySelector('.ts_token_bar_body .notokens');
        const node = bar.querySelector('.ts_token_bar_body');
        if (node) {
            let added = node.querySelector('.ts_token_wrap');
            def.innerHTML = '';
            if (added) return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let network = await provider.getNetwork();

        const signer = provider.getSigner();
        const userAddress = signer ? await signer.getAddress() : false;

        let tokenName = Object.keys(tokenNodesList).join('|');

        if (signer && userAddress ){
            def.innerHTML = "On the " + network.name + ", no token is found under your address " + userAddress + (tokenName ? " that matches the criteria objectClass="+tokenName : '') + (filter ? ' and filter="'+filter+'"' : '');

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
    };

    if (window.ethereum){
        ethereum.on('accountsChanged', passiveRenegotiateAll);
        ethereum.on('chainChanged', passiveRenegotiateAll);
        ethereum.on('connect', passiveRenegotiateAll);
        ethereum.on('disconnect', passiveRenegotiateAll);
    }


    return {
        negotiate,
        // getToken,
        // selectTokenFromList,
        parseXMLFromText,
        renegotiateAll
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

if (typeof module !== "undefined") module.exports = ts;