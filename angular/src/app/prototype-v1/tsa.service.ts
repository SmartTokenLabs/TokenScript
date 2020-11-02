import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpResponse} from '@angular/common/http';
// import { BigNumber } from '@ethersproject/bignumber';
import {BehaviorSubject, ReplaySubject , Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { uuidv4 } from '../utility';
import {Activity, ApprovedForMiningPool, ApprovedForLiquidityPool, LiquidityPoolShare, Token} from './types';

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

import Web3 from 'web3';
import {BigNumber} from '@ethersproject/bignumber';

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

  // private data$ = new BehaviorSubject({});
  private tokenGenerator$: BehaviorSubject<any>;
  private tokens = {};

  // private debug = false;
  private debug = environment.debug;
  private inited = false;
  private lang: string;
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

  public negotiateToken(): Observable<Token> {
    this.init();
    this.tokenGenerator$ = new BehaviorSubject<any>(
      // this.fakeData.generateToken()
      {} as Token
      // this.returnTokens(1)
    );
    // setInterval((x) => {
    //   tokenGenerator$.next(this.fakeData.generateToken());
    // }, 5000);

    return this.tokenGenerator$.asObservable();
  }

  private addTokensFiles(): void {
    const files = [
      // 'assets/LiquidityPoolShare.xml',
      'assets/BOOKY.xml',
      // 'assets/MiningPoolShare.xml',
      // 'assets/COFI.xml'
    ];
    for (const path of files){
      this.negotiateTokenByPath(path);
    }
  }

  /**
   * @description Currently just producing a random uuid
   * @returns dummy data
   */
  // TODO: change that to return just a string, not an 'Observable<string>'
  // TODO contract 20 bytes, payload unlimited bytes
  public createTransaction(
    contract: string,
    payload: string
  ): Observable<string> {
    const transactionId = uuidv4();
    return of(transactionId).pipe(delay(5000));
  }


  /**
   * @description Get the approved activity
   * @returns dummy data
   */
  public getCard<T extends Activity>(
    token: LiquidityPoolShare,
    cardName: string,
    transactionNonce: number,
    returnType: string,
    activityCardType = 'activity'
  ): Observable<any> {
    const replay$ = new ReplaySubject();
    if (returnType === 'ApprovedForLiquidityPool') {
      console.log('lets render activity card');
      this.renderCards({
        listener$: replay$,
        // tokenName: 'LiquidityPoolShare',
        tokenName: 'booky',
        // tokenInstance: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        tokenInstance: 'ownerAddress=0xcf91479f4AeC538bEc575Dc07Ecfb7f4640f4D61',
        // cardName: 'sent',
        cardName: 'received',
        cardType: 'activity',
        cardView: 'item-view',
        // returnHistory: false,
        returnHistory: true,
        listenNewEvents: true,
        transactionNonce,
        returnType
      });
    }
    return replay$.asObservable();
  }

  public renderView(modal: any): any {
    return '';
  }

  public negotiateTokenByContent(xmlContent: string): void {
    const newToken = parseXMLFromText(xmlContent);
    Object.keys(newToken).forEach(tokenName => {
      this.tokens[tokenName] = newToken[tokenName];
      this.tokens[tokenName].filter = '';
      this.renderTokenInstances(tokenName).then(() => this.returnTokens());
    });
  }

  private async renderTokenInstances(tokenName): Promise<void> {
    this.tokens[tokenName].working = true;
    this.tokens[tokenName].instances = {};
    this.tokens[tokenName].test = [];
    try {
      if (!this.ethersData || !Object.keys(this.ethersData).length) {
        this.ethersData = await getEthersData();
      }
      (this.debug > 0) && console.log(`negotiate fired for  ${tokenName}`);

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
          (this.debug > 1) && console.log(`lets add instance : ${distinctItem}`);

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
            (this.debug > 0) && console.log('compare failed');
            continue;
          }

          this.tokens[tokenName].instances[`${distinctProps.distinctName}=${distinctItem}`] = tokenInstance;
        }
      }
      this.tokens[tokenName].working = false;
      (this.debug > 2) && console.log('this.tokens');
      (this.debug > 2) && console.log(this.tokens);

    } catch (e) {
      const message = 'negotiate error = ' + e;
      this.debug && console.log(e);
      this.debug && console.log(message, e);
      this.tokens[tokenName].working = false;
      throw new Error(message);
    }
  }

  public negotiateTokenByPath(XMLPath: string): void {
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
  private returnTokens(justReturn = 0): any {
    (this.debug > 2 ) && console.log('this.tokens');
    (this.debug > 2 ) && console.log(this.tokens);
    const output = {};
    Object.keys(this.tokens).forEach(key => {
      const instances = this.tokens[key].instances;
      const returnInstances = {};
      Object.keys(instances).forEach(
        instanceId => returnInstances[instanceId] = instances[instanceId].props);
      output[key] = returnInstances;
    });
    if (justReturn) {
      return output;
    }
    this.tokenGenerator$.next(output);
  }

  private init(): void{
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

      if (window.ethereum){
        window.ethereum.on('accountsChanged', this.reInit);
        window.ethereum.on('chainChanged', this.reInit);
        window.ethereum.on('connect', this.reInit);
        window.ethereum.on('disconnect', this.reInit);
      }
      // console.log('init ok');
    } catch (e) {
      const message = ' ;init error happened -> ' + e;
      // tslint:disable-next-line:no-unused-expression
      this.debug && console.log(message);
      // tslint:disable-next-line:no-unused-expression
      this.debug && console.log(e);
      // throw new Error(message);
    }

    // this.tokenGenerator$.subscribe(tokens => {
    //   this.tokens = tokens;
    //   console.log('tokens');
    //   console.log(tokens);
    //   Object.keys(tokens).forEach(tokenName => {
    //     const ids = Object.keys(tokens[tokenName]);
    //     if (ids.length) {
    //       ids.forEach(id => {
    //         const listener$ = new Subject();
    //         listener$.subscribe(card => {
    //           // console.log('card received');
    //           // console.log(card);
    //         } );
    //         this.tsaService.renderCards({
    //           listener$,
    //           tokenName,
    //           tokenInstance: id,
    //           // cardName: 'sent',
    //           cardName: 'received',
    //           cardType: 'activity',
    //           cardView: 'item-view',
    //           returnHistory: true,
    //           listenNewEvents: true,
    //           transactionNonce: null
    //         });
    //       });
    //     }
    //   });
    //
    // });
    this.addTokensFiles();
  }

  private async reInit(): Promise<any>{
    this.ethersData = await getEthersData();

    Object.keys(this.tokens).forEach(tokenName => {
      this.tokens[tokenName].instances = {};
      this.renderTokenInstances(tokenName).then(() => this.returnTokens());
    });
  }

  // getConfig(): any{
  //   return this.config;
  // }

  // setLang(lang: string): void {
  //   lang = lang ? lang : this.config.lang;
  //   this.lang = lang;
  // }

  private renderCards({listener$, tokenName, tokenInstance, cardName, cardType, cardView, returnHistory, listenNewEvents, transactionNonce, returnType}): any {
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
    (this.debug > 1 ) && console.log('lets instance.getCardItems');

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

        instance.getCardItems({cardName, cardType, cardView, returnHistory, listenNewEvents, listener$, transactionNonce});

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
      instance.getCardItems({cardName, cardType, cardView, returnHistory, listenNewEvents, listener$, transactionNonce});
    }
  }
}


