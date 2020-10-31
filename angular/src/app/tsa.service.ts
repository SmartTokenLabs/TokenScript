import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse} from '@angular/common/http';
import { BigNumber } from '@ethersproject/bignumber';
import {
  getEthersData,
  parseXMLFromText,
  TokenCard,
  extendPropsWithContracts,
  to,
  compareStringToProps,
  getXMLItem, getXMLItemText
} from './lib';
import { EthersData } from './types';

declare let require: any;

const Web3 = require('web3');
const ethers = require('ethers');

import {BehaviorSubject} from 'rxjs';

declare global {
  interface Window {
    ethereum: any;
  }

  interface Node {
    getAttribute: any;
  }
}

@Injectable({
  providedIn: 'root',
})

export class TsaService {

  private data$ = new BehaviorSubject({});
  private tokens = {};

  // private debug = false;
  private debug = true;
  private inited = false;
  private lang: string;
  private tokenNodesList = {};
  private config = {
    // name for <meta name="token.filter" content="objectClass=booky"/>
    tokenMeta: 'token.filter',
    lang: 'en',
    inject_web3: true,
    card_view: 'ts:item-view',
    // "<ts:card name="main" type="token">" or "<ts:card exclude="expired" name="enter" type="action">"
    card_name: 'main',
    card_type: 'action',
    contractJsonPath: ''
  };
  private ethersData: EthersData;
  private web3: any;

  constructor(private http: HttpClient) {}

  negotiateTokenByContent(xmlContent: string): void {
    const newToken = parseXMLFromText(xmlContent);
    Object.keys(newToken).forEach(tokenName => {
      this.tokens[tokenName] = newToken[tokenName];
      this.tokens[tokenName].filter = '';
      this.renderTokenInstances(tokenName).then(() => this.returnTokens());
    });
  }

  async renderTokenInstances(tokenName): Promise<void> {
    this.tokens[tokenName].working = true;
    this.tokens[tokenName].instances = {};
    this.tokens[tokenName].test = [];
    try {
      if (!this.ethersData || !Object.keys(this.ethersData).length) {
        this.ethersData = await getEthersData();
      }
      this.debug && console.log('negotiate fired for ' + tokenName);

      const initialTokenInstance = new TokenCard({
        xmlDoc: this.tokens[tokenName].xmlDoc,
        lang: this.lang,
        fallbackLang: this.config.lang,
        tokenName,
        ethersData: this.ethersData,
        filter: this.tokens[tokenName].filter,
        debug: this.debug
      });
      const distinctProps = await initialTokenInstance.getDistinctItems();
      const commonInitProps = extendPropsWithContracts(this.tokens[tokenName].xmlDoc, {}, this.ethersData);
      commonInitProps.ownerAddress = this.ethersData.userAddress;

      // console.log('contracts');
      // console.log(contracts);
      // console.log('distinctProps');
      // console.log(distinctProps);

      if (distinctProps && distinctProps.items && distinctProps.items.length) {

        let i = 0;
        for (; i < distinctProps.items.length; i++) {
          const distinctItem = distinctProps.items[i];
          this.debug && console.log('lets add instance :', distinctItem);

          const initProps = Object.assign({}, commonInitProps);
          initProps[distinctProps.distinctName] = distinctItem;
          // console.log('initProps');
          // console.log(JSON.stringify(initProps));

          const tokenInstance = new TokenCard({
            xmlDoc: this.tokens[tokenName].xmlDoc,
            lang: this.lang,
            fallbackLang: this.config.lang,
            tokenName,
            ethersData: this.ethersData,
            filter: this.tokens[tokenName],
            debug: this.debug,
            props: initProps
          });

          const [propsError, props] = await to(tokenInstance.getProps() );
          this.tokens[tokenName].props = props;

          // console.log('tokenInstance.getProps');
          // console.log(props);
          // props[distinctProps.distinctName] = tokenID;
          // console.log('updated props');
          // console.log(props);

          const compareRes = compareStringToProps(this.tokens[tokenName].filter, props);
          if (!compareRes) {
            console.log('compare failed');
            continue;
          }

          this.tokens[tokenName].instances[distinctItem] = tokenInstance;
        }
      }
      this.tokens[tokenName].working = false;
      console.log('this.tokens');
      console.log(this.tokens);

    } catch (e) {
      const message = 'negotiate error = ' + e;
      this.debug && console.log(e);
      this.debug && console.log(message, e);
      this.tokens[tokenName].working = false;
      throw new Error(message);
    }
  }

  negotiateTokenByPath(XMLPath: string): void {
    this.http.get(XMLPath, {responseType: 'text'})
      .subscribe(
        data => {
          this.negotiateTokenByContent(data);
        },
        error => console.log('XML file load failed for ' + XMLPath, error)
    );
  }

  /**
   * Render tokens output in format {TokenName: [tokenInstance1,...]}
   */
  returnTokens(): void {
    const output = {};
    Object.keys(this.tokens).forEach(key => {
      const instances = this.tokens[key].instances;
      const returnInstances = {};
      Object.keys(instances).forEach(
        instanceId => returnInstances[instanceId] = instances[instanceId].props);
      output[key] = returnInstances;
    });
    this.data$.next(output);
  }

  init(): void{
    if (this.inited) {
      return;
    }
    try {
      if (window.location.protocol === 'file:') {
        throw new Error('Please load this App from HTTP/HTTPS server(local web server should work good), because of browser security reason you can\'t connect remote server from local file script.');
      }

      if (!window.ethereum) {
        throw new Error('Ethereum Wallet doesnt work at this page, please enable it and reload page.');
      }

      // if (!Web3 && !window.ethers) {
      // if (!Web3) {
      //   // throw new Error("Please load Web3 or ethers.js library before this App");
      //   throw new Error('Please load Web3 library before this App');
      // }
      // if (!window.ethers) {
      //   throw new Error('Please load ethers.js library before this App');
      // }

      this.web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

      this.inited = true;
      // console.log('init ok');
    } catch (e) {
      const message = ' ;init error happened -> ' + e;
      // tslint:disable-next-line:no-unused-expression
      this.debug && console.log(message);
      // tslint:disable-next-line:no-unused-expression
      this.debug && console.log(e);
      // throw new Error(message);
    }
  }

  async reInit(): Promise<any>{
    this.ethersData = await getEthersData();
    console.log(this.ethersData);
  }

  // getConfig(): any{
  //   return this.config;
  // }

  setLang(lang: string): void {
    lang = lang ? lang : this.config.lang;
    this.lang = lang;
  }

  renderCards({listener, tokenName, tokenInstance, cardName, cardType, cardView, returnHistory, listenNewEvents, transactionNonce}): any {
    // console.log('lets instance.getCardItems');
    // console.log(tokenName);
    // console.log(this.tokens[tokenName]);
    const token = this.tokens[tokenName];
    if (!token) {
      console.log('cant see token name = ' + tokenName);
      return false;
    }
    const instance = token.instances[tokenInstance];
    if (!instance) {
      console.log('cant see tokenInstance = ' + tokenInstance);
      return false;
    }
    console.log('lets instance.getCardItems');

    const iframeId = cardName + '_' + cardType + '_' + cardView;

    let iframeDoc;
    let iframe = instance.iframes[iframeId];
    if (!iframe) {
      let cardHtml = '';

      // get card-view html
      let selector = '/ts:token/ts:cards/ts:card';
      if (cardName) {
        selector += '[@name="' + cardName + '"]';
      }
      if (cardType) {
        selector += '[@type="' + cardType + '"]';
      }

      const cardNode = getXMLItem(instance.xmlDoc, selector );
      if (!cardNode) {
        this.debug && console.log('cant see card for >>>' + selector + '<<<');
      } else {
        cardHtml = getXMLItemText(
          instance.xmlDoc,
          'ts:' + cardView + '[@xml:lang="' + this.lang + '"][1]',
          cardNode,
          'ts:' + cardView + '[@xml:lang="' + instance.fallbackLang + '"][1]', instance.debug );

        instance.debug && console.log('renderCardView started for name=' + cardName + '; type = ' + cardType + '; itemType=' + cardView);

        // instance.debug && console.log('cardHtml');
        // instance.debug && console.log(cardHtml);
      }

      iframe = document.createElement('iframe');
      instance.iframes[iframeId] = iframe;
      iframe.src = 'assets/blank.html';
      iframe.style = 'display: none;';
      const body = document.querySelector('body');
      iframe.onload = () => {
        // let iframeWindow = iframe || iframe.contentWindow;
        // iframeWindow.addEventListener('load', () => {

        // let onloadProps =

        // console.log('props inside onload for'+cardName + '-' + cardType);
        // console.log(props);

        console.log('iframe.onload fired;');
        // this.debug && console.log('iframe.onload fired;');
        iframe.contentWindow.onerror = e => {console.log('iframe error'); console.log(e); };

        iframeDoc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;

        /* Inject helper JS code */
        let code = instance.iframeHelper.toString();
        // console.log(code);
        code = code.substring(16, code.length - 1);
        console.log(code);
        instance.insertScript(iframeDoc, code);

        const innerBody = iframeDoc.getElementsByTagName('body');

        if (!innerBody) {
          console.log('Cant see iframe body tag');
          return;
        }

        // const origin = document.defaultView.location.origin;


        let html = cardHtml ? instance.replace_all(cardHtml, '<body>', '') : '';
        html = instance.replace_all(html, '</body>', '');

        let div = iframeDoc.createElement('div');
        div.setAttribute('class', 'main');
        div.innerHTML = instance.decodeHtml(html);
        const scripts = div.querySelectorAll('script');

        // test iframe ethereum and web3
        const iframeEthereumExists = iframe.contentWindow.is_ethereum_exists();
        const iframeWeb3Exists = iframe.contentWindow.is_web3_exists();
        this.debug && console.log('iframeEthereumExists = ' + iframeEthereumExists);
        this.debug && console.log('iframeWeb3Exists = ' + iframeWeb3Exists);
        if (!iframeEthereumExists || !iframeWeb3Exists) {
          console.error('Ethereum or web3 missed');
        } else {
          // inject helper code to fix web3.tokens.dataChanged and other errors
          code = instance.web3TokensExtention.toString();
          code = code.substring(23, code.length - 1);
          instance.insertScript(iframeDoc, code);
        }

        // insert all scripts from card-view
        if (scripts.length){
          scripts.forEach(item => {
            // let data = {
            //     action:'inject_script',
            //     content: this.decodeHtml(item.innerText)
            // };
            // iframe.contentWindow.postMessage(JSON.stringify(data),origin);
            // console.log(item.innerText);
            // this.insertScript(iframeDoc,this.decodeHtml(item.innerText));
            instance.insertScript(iframeDoc, item.innerText);
            item.remove();
          });
        }

        // clean body code and add card-view html(without scripts)
        innerBody[0].innerHTML = '';
        innerBody[0].appendChild(div);

        div = iframeDoc.createElement('div');
        const mainDiv = iframeDoc.querySelector('body .main');
        div.setAttribute('id', 'render');
        // div.setAttribute('class', '');
        mainDiv.appendChild(div);

        instance.getCardItems({cardName, cardType, cardView, returnHistory, listenNewEvents, listener, transactionNonce});

        // iframeDoc.dispatchEvent(new Event('DOMContentLoaded', {
        //   bubbles: true,
        //   cancelable: true
        // }));
        // setTimeout(()=>{
        //     console.log('iframe.dispatchEvent(new Event("load"');
        //     iframe.contentWindow.onload();
        //     // iframe.dispatchEvent(new Event("load", {
        //     //     bubbles: true,
        //     //     cancelable: true
        //     // }));
        // }, 500);

      };
      body.appendChild(iframe);
    } else {
      instance.getCardItems({cardName, cardType, cardView, returnHistory, listenNewEvents, listener, transactionNonce});
    }
  }

  listenTokens(): BehaviorSubject<any> {
    this.init();
    return this.data$;
  }
}


