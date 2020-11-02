import { EthersData, EthereumCallParams, ContractAddress, ERC20Props } from './types';
import { erc20abi, CoFiXPairAbi } from './abis';
import { ApprovedForLiquidityPool, TokenProps } from './types';

const matchAll = require('string.prototype.matchall');

declare global {
  interface Window {
    web3: any;

    is_ethereum_exists(): boolean;

    is_web3_exists(): boolean;
  }
}

// import Web3 from 'web3';
import {BigNumber, ethers} from 'ethers';

export async function getEthersData(): Promise<EthersData>{
  await window.ethereum.request({ method: 'eth_requestAccounts' });
    // .then((accounts) => console.log(accounts))
    // .catch((error) => console.error(error));

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  if (!signer) { throw new Error('Active Wallet required'); }

  const userAddress = await signer.getAddress();
  const networkInfo = await provider.getNetwork();

  let chainID;
  if (networkInfo) {
    // tslint:disable-next-line:prefer-const
    chainID = networkInfo.chainId;
  } else {
    throw new Error('Cant read chainID');
  }
  return { provider, signer, userAddress, chainID };
}

export function compareStringToProps(str: string, props, debug = false): number{
  if (typeof str === 'string') {
    str = str.trim();
  }
  if (!str) {
    // tslint:disable-next-line:no-unused-expression
    debug && console.log('empty filter');
    return 1;
  }
  // let match = str.matchAll(/(\([^)(]+\))/g);
  let match = matchAll(str, new RegExp('(\\([^)(]+\\))', 'g'));
  let matchAllResults = Array.from(match);
  // tslint:disable-next-line:no-unused-expression
  debug && console.log('matchAll');
  // tslint:disable-next-line:no-unused-expression
  debug && console.log(matchAllResults);
  matchAllResults.forEach(item => {
    const single = item[1];
    // console.log('wrong pattern : ' + item + ', skipped');
    const matchProp = single.match(/\(([^<>=]+)(=|<=|>=)([^<>=]+)\)/);
    if (!matchProp) {
      str = str.replace(single, '0');
      // tslint:disable-next-line:no-unused-expression
      debug && console.log('wrong pattern : ' + single + ', skipped, str = "' + str + '"');
      return;
    }
    // tslint:disable-next-line:no-unused-expression
    debug && console.log('matchProp');
    // tslint:disable-next-line:no-unused-expression
    debug && console.log(matchProp);
    const propName = matchProp[1].trim();
    const propCompare = matchProp[2];
    const propTest = matchProp[3].trim();
    const propValue = props[propName];

    if (!propValue) {
      // tslint:disable-next-line:no-unused-expression
      debug && console.log('property check false(prop not exists or empty) for: ' + propName + ', while serve ' + item[0]);
      str = str.replace(item[0], '0');
    } else {
      // let compareRes = propValue.match(//);
      let result;
      switch (propCompare) {
        case '=':
          if (propTest.trim() === '*') {
            result = '1';
            break;
          }
          // quote all regex symbols except of *
          const re = new RegExp(propTest.replace(/([.?+^$[\]\\(){}|-])/g, '\\$1'));
          result = propValue.match(re);
          break;
        case '<=':
          result = parseFloat(propValue) < parseFloat(propTest);
          // tslint:disable-next-line:no-unused-expression max-line-length
          debug && console.log('propValue = ' + parseFloat(propValue) + ' ; propTest = ' + parseFloat(propTest) + '; compare = ' + propCompare + ' ; result = ' + result);
          break;
        case '>=':
          result = parseFloat(propValue) > parseFloat(propTest);
          break;
        default:
          // tslint:disable-next-line:no-unused-expression
          debug && console.log('compare string error. wrong part: ' + matchProp[0] + ' at the moment: ' + str);
          str = '-1';
      }
      str = str.replace(item[0], result ? '1' : '0');
    }
    // tslint:disable-next-line:no-unused-expression
    debug && console.log('compare string result after : ' + single + ' = ' + str);
  });

  let counter = 0;
  // while ((matchAllResults = Array.from((match = str.matchAll(/(\(([!|&]?)([^)(]+)\))/g)))).length) {
  // let match = matchAll(str, new RegExp('(\\([^)(]+\\))', 'g'))
  while ((matchAllResults = Array.from((match = matchAll('(\(([!|&]?)([^)(]+)\))', 'g') ) ) ).length) {

    // tslint:disable-next-line:no-unused-expression
    debug && console.log('matchAll');
    // tslint:disable-next-line:no-unused-expression
    debug && console.log(matchAllResults);
    matchAllResults.forEach(item => {
      const inner = item[0];
      const compare = item[2];
      const bits = item[3];
      switch (compare) {
        case '':
          switch (inner) {
            case '(1)': str = str.replace(item[0], '1');
                        break;
            case '(0)': str = str.replace(item[0], '0');
                        break;
            default:
              console.log('compare string error. wrong part: ' + inner + ' at the moment: ' + str);
              str = '-1';
          }
          break;
        case '!':
          switch (inner) {
            case '(!1)': str = str.replace(item[0], '0');
                         break;
            case '(!0)': str = str.replace(item[0], '1');
                         break;
            default:
              // tslint:disable-next-line:no-unused-expression
              debug && console.log('compare string error. wrong part: ' + inner + ' at the moment: ' + str);
              str = '-1';
          }
          break;
        case '|':
          str = str.replace(item[0], bits.includes('1') ? '1' : '0');
          break;
        case '&':
          str = str.replace(item[0], bits.includes('0') ? '0' : '1');
          break;
        default:
          // tslint:disable-next-line:no-unused-expression
          debug && console.log('compare string error. wrong part: ' + inner + ' at the moment: ' + str);
          str = '-1';
      }
      // tslint:disable-next-line:no-unused-expression
      debug && console.log('second pass temp res = ' + str);

      // let innerMatch
    });
    // tslint:disable-next-line:no-unused-expression
    debug && console.log('second pass cycle ' + counter + ' finish res = ' + str);
    counter ++;
    if (counter > 5) {
      // tslint:disable-next-line:no-unused-expression
      debug && console.log('its loop, check string please: ' + str);
      str = '-1';
      break;
    }
  }

  // tslint:disable-next-line:no-unused-expression
  debug && console.log('finish res = ' + str);

  return parseInt(str, 10);
}

export function getContractAddress(xmlDoc, ethContract, chainID): ContractAddress{

  const contractNode = getXMLItem(xmlDoc, '/ts:token/ts:contract[@name="' + ethContract + '"][1]');
  let contractInterface;
  let contractAddress;
  if (contractNode){
    contractInterface = contractNode.getAttribute('interface');
    contractAddress = getXMLItemText(xmlDoc, 'ts:address[@network=' + chainID + '][1]', contractNode);
  }

  return { contractInterface, contractAddress };
}

export function getXMLItemText(xmlDoc, selector, context = '', fallbackSelector = '', debug = false): string{
  const item = getXMLItem(xmlDoc, selector, context, fallbackSelector);
  if ( item ) {
    return item.innerHTML;
  } else {
    // tslint:disable-next-line:no-unused-expression
    debug && console.log(selector);
    // tslint:disable-next-line:no-unused-expression
    debug && console.log('Cant find value');
  }
}

export function getXMLItem(xmlDoc, selector, context: any = '' , fallbackSelector = ''): any {
  context = context ? context : xmlDoc;
  const nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
  let xmlNode;

  xmlNode = xmlDoc.evaluate(selector, context, nsResolver, XPathResult.ANY_TYPE, null );
  xmlNode = (xmlNode && !fallbackSelector) ? xmlNode : xmlDoc.evaluate(fallbackSelector, context, nsResolver, XPathResult.ANY_TYPE, null );

  return xmlNode ? xmlNode.iterateNext() : false;
}

export function to(promise, improved = false): [any, any]{
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (improved) {
        Object.assign(err, improved);
      }

      return [err, null]; // which is same as [err, undefined];
    });
}

export async function getJSONAbi(ethContract, jsons, path = '', debug = 0): Promise<{}>{
  let contractJson = jsons ? jsons[ethContract] : false;

  if (contractJson) { return contractJson; }

  if (ethContract === 'pool') { return CoFiXPairAbi; }

  if (ethContract === 'pair') { return erc20abi; }

  if (ethContract === 'booky') { return erc20abi; }

  try {
    const response = await fetch(path + ethContract + '.json');
    if (response.status !== 200) {
      const message = 'Looks like there was a problem. Status Code: ' +
        response.status;
      // tslint:disable-next-line:no-unused-expression
      debug && console.log(message);
      throw new Error(message);
    }
    contractJson = await response.json();
    jsons[ethContract] = contractJson;

  } catch (e) {
    const message = 'token JSON fetch error. ' + e;
    // tslint:disable-next-line:no-unused-expression
    debug && console.log(e);
    // tslint:disable-next-line:no-unused-expression
    debug && console.log(message);
    // throw new Error(message);
    return false;
  }

  return contractJson;
}

export function filterResultConverter(resArgs, incomeProps): TokenProps {
  // console.log('filterResultConverter input = ');
  // console.log(resArgs);
  const resultProps = Object.assign({}, incomeProps);
  // console.log(resultProps);
  ['owner', 'spender', 'from', 'to', 'value', 'amount'].forEach(arg => {
    if (resArgs[arg]) { resultProps[arg] = resArgs[arg]; }
  });
  // console.log('resultProps');
  // console.log(resultProps);
  return resultProps;
}

export function bnStringPrecision(bn, decimals, precision): number{
  bn = ethers.BigNumber.from(bn);
  if (precision > 15) { precision = 15; }
  // while (precision > 15){
  //     bn = bn.mul(10**15);
  //     precision -= 15;
  // }
  bn = bn.mul(10 ** precision);

  while (decimals > 15){
    bn = bn.div(10 ** 15);
    decimals -= 15;
  }
  bn = bn.div(10 ** decimals);

  return bn.toNumber() / 10 ** precision;
}

export function getEthereumCallParams({userAddress, ethereumNode , xmlDoc,  tokenName, debug, props}): EthereumCallParams{
  // console.log('getEthereumCallParams input props');
  // console.log(props);

  // get default contract Name
  const xmlNode = getXMLItem(xmlDoc, '/ts:token/ts:origins/ts:ethereum[1]');
  let defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';
  defaultContract = defaultContract ? defaultContract : tokenName;

  const params = [];

  if (!ethereumNode) {
    console.log('cant see attribute');
    return {
      params: [null],
      ethCallAttributtes: {} as any,
    };
  }

  const atts = ethereumNode.getAttributeNames();
  const ethCallAttributtes = {contract: ''};
  atts.forEach(attName => {
    ethCallAttributtes[attName] = ethereumNode.getAttribute(attName);
  });

  ethCallAttributtes.contract = ethCallAttributtes.contract ? ethCallAttributtes.contract : defaultContract;

  const nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
  const xmlNodeSet = xmlDoc.evaluate('ts:data/*', ethereumNode, nsResolver, XPathResult.ANY_TYPE, null );

  let item;

  // tslint:disable-next-line:no-conditional-assignment
  while (xmlNodeSet && (item = xmlNodeSet.iterateNext())){
    const ref = item.getAttribute('ref');
    // console.log('ref');
    // console.log(ref);
    if ( props.hasOwnProperty(ref) ) {
      params.push(props[ref]);
    } else if (item.innerHTML) {
      params.push(item.innerHTML);
    }
  }

  return {
    // @ts-ignore
    params,
    ethCallAttributtes
  };

}

export function getErc20EventParams(erc20EventName, xmlDoc): {}{
  const nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);

  const eventXmlNodes = xmlDoc.evaluate('/ts:token/asnx:module[@name="ERC20-Events"]/namedType[@name="' + erc20EventName + '"]', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );



  const params = {};

  const moduleNode = eventXmlNodes.iterateNext();
  if (moduleNode) {

    const eventElementsXmlNodes = xmlDoc.evaluate('type/sequence/element', moduleNode, nsResolver, XPathResult.ANY_TYPE, null );

    let eventElementsXmlNode;
    // tslint:disable-next-line:no-conditional-assignment
    while ( eventElementsXmlNode = eventElementsXmlNodes.iterateNext() ) {
      params[eventElementsXmlNode.getAttribute('name')] = null;
    }
  } else {
    return false;
  }

  return params;
}

export function parseXMLFromText(xmlText): any{
  const xmlDoc = (new window.DOMParser()).parseFromString(xmlText, 'text/xml');
  const tokenNode = getXMLItem(xmlDoc, '/ts:token');

  if (tokenNode) {
    const tokens = {};
    tokens[tokenNode.getAttribute('name')] = {
      xmlDoc,
      filter: '',
      views: getXMLViews(xmlDoc)
    };
    return tokens;
  }
  return {};
}

export function getXMLViews(xmlDoc): any{
  const nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
  const cardNodes = xmlDoc.evaluate('/ts:token/ts:cards/ts:card', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
  const views = [];
  let cardNode;
  // tslint:disable-next-line:no-conditional-assignment
  while (cardNode = cardNodes.iterateNext()) {
    const name = cardNode.getAttribute('name');
    const type = cardNode.getAttribute('type');
    const viewNodes = xmlDoc.evaluate('ts:item-view|ts:view', cardNode, nsResolver, XPathResult.ANY_TYPE, null );
    let viewNode;
    // tslint:disable-next-line:no-conditional-assignment
    while (viewNode = viewNodes.iterateNext()) {
      const view = viewNode.nodeName;
      views.push({name, type, view});
    }
  }
  return views;
}

export function extendPropsWithContracts(xmlDoc, props = {}, ethersData: EthersData): any{
  const nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
  const contractNodes = xmlDoc.evaluate('/ts:token/ts:contract', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
  const output = Object.assign({}, props);
  let contractNode;
  // tslint:disable-next-line:no-conditional-assignment
  while (contractNode = contractNodes.iterateNext()) {
    const name = contractNode.getAttribute('name');

    const address = getXMLItemText(xmlDoc, 'ts:address[@network="' + ethersData.chainID + '"]', contractNode);
    if (address) {
      output[name] = address;
    }
  }
  return output;
}

export class TokenCard {
  xmlDoc: any;
  tokenName: string;
  tokenID: string;
  distinctName: string;
  toRender: any;
  lang: string;
  ethersData: EthersData;
  filter: string;
  activitiesRenderStarted: boolean;
  ready: boolean;
  // cardName: string;
  // cardType: string;
  // viewType: string;
  fallbackLang: string;
  debug: number;
  nsResolver: any;
  defaultContract: string;
  jsons: {};
  contractJsonPath: string;
  props: ERC20Props;
  iframes: {};

  constructor(data) {
    this.xmlDoc = data.xmlDoc;
    this.tokenName = data.tokenName;
    this.toRender = data.wrapNode;
    this.lang = data.lang;
    this.ethersData = data.ethersData;
    this.filter = data.filter;
    this.activitiesRenderStarted = false;

    // this.cardName = data.cardName ? data.cardName : 'main';
    // this.cardType = data.cardType ? data.cardType : 'token';
    // this.viewType = data.viewType ? data.viewType : 'item-view';

    this.fallbackLang = 'en';
    this.ready = false;

    this.debug = data.debug;

    this.nsResolver = this.xmlDoc.createNSResolver( this.xmlDoc.ownerDocument == null ? this.xmlDoc.documentElement : this.xmlDoc.ownerDocument.documentElement);

    const xmlNode = getXMLItem(this.xmlDoc, 'ts:origins/ts:ethereum[1]');
    this.defaultContract = xmlNode ? xmlNode.getAttribute('contract') : '';
    this.defaultContract = this.defaultContract ? this.defaultContract : this.tokenName;

    this.props = data.props;
    this.jsons = {};
    this.iframes = {};
  }

  async getDistinctItems(): Promise<{distinctName: string, items: [string]}>{
      // console.log('await distinct props');
      // let props = await this.getProps();
      // this.debug && console.log('props received');
      // this.debug && console.log(props);

      const distinctAttributeNode = getXMLItem(this.xmlDoc, '/ts:token/ts:attribute[@distinct="true"][1]');
      // console.log('distinctAttributeNode');
      // console.log(this.tokenName);
      // console.log(distinctAttributeNode);
      // console.log(this.xmlDoc);

      if (!distinctAttributeNode) {
        this.debug && console.log('Cant find distinct attribute, lets use ownerAddress');
        return {
          distinctName: 'ownerAddress',
          items: [this.ethersData.userAddress]
        };
      } else {

        const distinctName = distinctAttributeNode.getAttribute('name');
        const [ attrError, distinctData] = await to(this.getAttributeValue(distinctName));
        const items = [];
        if (attrError) {
          console.log('error while receive distinct');
          console.log(attrError);
        }

        // console.log('distinctData');
        // console.log(distinctData);

        if (distinctData && distinctData.length) {
          distinctData.forEach(a => {
            if (a._isBigNumber) {
              items.push( a.toHexString() );
            } else if (typeof a === 'string') {
              items.push( a );
            } else {
              items.push( a.toString() );
            }
          });
        } else {
          this.debug && console.log('Empty token list');
        }

        return {
          distinctName,
          // @ts-ignore
          items
        };
      }
    }

  runMainDataChanged(internalNode): void{
    const tokenWrapNode = internalNode.closest('.ts_token_wrap');
    const tokenIdWrapNode = tokenWrapNode.querySelector('.ts_tokenitem_wrap');
    // console.log(internalNode);
    const tokenIframe = tokenIdWrapNode.querySelector('iframe');
    const win = tokenIframe.contentWindow;
    const instance = tokenWrapNode.instance;
    // console.log('vars:');
    // console.log(tokenIframe);
    // console.log(win);
    // console.log(instance);
    instance.getProps().then(res => {
      if (win.web3.tokens.dataChanged){
        win.web3.tokens.data.currentInstance = res;
        win.web3.tokens.dataChanged(null, {currentInstance: res}, null );
      }
    });
  }

  async getProps(): Promise<any>{
    // console.log('start getProps. init props = ');
    // console.log(this.props);
    const basicProps: ERC20Props = this.props;
    try {
      this.ethersData = await getEthersData();

      const attributeXmlNodes = this.xmlDoc.evaluate('/ts:token/ts:attribute', this.xmlDoc, this.nsResolver, XPathResult.ANY_TYPE, null );
      // console.log('start getProps');

      let attributeNode;

      // tslint:disable-next-line:no-conditional-assignment
      while (attributeXmlNodes && (attributeNode = attributeXmlNodes.iterateNext() ) ) {
        if (attributeNode.getAttribute('distinct')) {
          // console.log('prop distinct');
          continue;
        }

        const name = attributeNode.getAttribute('name');

        this.debug && console.log('get prop = ' + name + '; current props = ' + JSON.stringify(this.props) );

        const [error, res] = await to(this.getAttributeValue(name) );
        if (error) {
          console.log('getAttributeValue error');
          console.log(error);
        }

        this.debug && console.log('property "' + name + '" has value :"');
        this.debug && console.log(res);

        if (res) { basicProps[name] = res; }
      }

      // let res = output._isBigNumber ? bnStringPrecision(output,18,8) : output;
      // if (basicProps.decimals && basicProps.ownerBalance) {
        // basicProps.ownerBalance = bnStringPrecision(basicProps.ownerBalance, basicProps.decimals, 10);
      // }
      // console.log('basic props:');
      // console.log(basicProps );
      // console.log(JSON.stringify(basicProps) );
    } catch (e) {
      const message = 'getProps() error. ' + e;
      this.debug && console.log(e);
      this.debug && console.log(message);
      throw new Error(message);
    }
    this.props = basicProps;
    // console.log('basicProps');
    // console.log(basicProps);
    return basicProps;
  }

  async getAttributeValue(name): Promise<any>{
    let res;
    if (!name) { return null; }
    const originsInnerNode = getXMLItem(this.xmlDoc , '/ts:token/ts:attribute[@name="' + name + '"]/ts:origins/*[1]');
    if (!originsInnerNode) {
      return null;
    }

    const dataNodeName = originsInnerNode.nodeName;
    switch (dataNodeName) {
      case 'ts:token-id':
        res = this.props.tokenId;
        this.debug && console.log('its ts:token-id, just use tokenID ');
        break;
      case 'ts:data':

        const attributeDataNodes = this.xmlDoc.evaluate('ts:address', originsInnerNode, this.nsResolver, XPathResult.ANY_TYPE, null );
        let addressNode;
        res = [];

        // tslint:disable-next-line:no-conditional-assignment
        while (attributeDataNodes && (addressNode = attributeDataNodes.iterateNext() ) ) {
          if (addressNode && addressNode.innerHTML){
            res.push(addressNode.innerHTML);
          }

        }

        this.debug && console.log('its ts:data');
        this.debug && console.log( JSON.stringify(res) );

        break;
      case 'ts:attribute':
        const ref = originsInnerNode.getAttribute('ref');
        const key = this.props[ref];
        if (typeof key === 'string'){
          const selector = 'ts:mapping/ts:option[@key="' + key + '"]/ts:value';
          res = getXMLItemText(this.xmlDoc,
            selector + '[@xml:lang="' + this.lang + '"][1]',
            originsInnerNode,
            selector + '[@xml:lang="' + this.fallbackLang + '"][1]' );
        }

        this.debug && console.log('its ts:data');
        this.debug && console.log( JSON.stringify(res) );

        break;
      case 'ethereum:call':
        this.debug && console.log('its ethereum call start for:');
        this.debug && console.log(originsInnerNode);
        const {
          params,
          ethCallAttributtes
        } = getEthereumCallParams({
          userAddress: this.ethersData.userAddress,
          ethereumNode: originsInnerNode,
          xmlDoc: this.xmlDoc,
          tokenName: this.tokenName,
          props: this.props,
          debug: this.debug,
        });

        let contract = getContractAddress(this.xmlDoc, ethCallAttributtes.contract, this.ethersData.chainID);

        if ( !contract || !contract.contractAddress ) {
          const contractName = originsInnerNode.getAttribute('contract');
          if (this.props.hasOwnProperty(contractName)) {
            contract = {contractAddress: this.props[contractName]};
          } else {
            const [attrError, contractAddressFromAttribute] = await to( this.getAttributeValue(contractName) );
            if (attrError) { console.log('getAttributeValue error'); }

            contract = {contractAddress: contractAddressFromAttribute};
          }
        }

        // console.log('getEthereumCallParams params');
        // console.log(params);
        // console.log(contract);

        if ( !contract.contractAddress ) {
          this.debug && console.log(
            ' ethContract and contractAddress required for {Address='
            + this.ethersData.userAddress
            + ', chainID = ' + this.ethersData.chainID
            + ' , tokenName = ' + this.tokenName + '}. Check logs for details'
          );

          res = null;
          break;
        }

        // if (missedAttribute) {
        //     this.debug && console.log('missed attribute: "' + missedAttribute + '", ethereum call skipped');
        //     break;
        // }

        const [abiError, abi] = await to( getJSONAbi(ethCallAttributtes.contract, this.jsons, '', this.debug ) );

        if (!abi) {
          console.error('Cant get Contract ABI for "' + ethCallAttributtes.contract + '" , attribute "' + name + '" skipped');
          throw new Error('Empty ABI for ' + ethCallAttributtes.contract);
        }
        if (abiError) {
          throw new Error(abiError);
        }

        this.jsons[ethCallAttributtes.contract] = abi;


        const ethersContract = new ethers.Contract(contract.contractAddress, abi, this.ethersData.provider);
        this.debug && console.log('ethFunction = ' + ethCallAttributtes.function + '; name = ' + name + '; params = '  );
        this.debug && console.log(params);
        this.debug && console.log(contract);
        this.debug && console.log(ethCallAttributtes);

        const [error, output] = await to(ethersContract[ethCallAttributtes.function].apply(null, params) );
        if (error) {
          console.error('error while try to get attribute "' + name + '" value');
        } else {
          this.debug && console.log('correct output for "' + name + '"');
          this.debug && console.log(output);
          // let res = output._isBigNumber ? bnStringPrecision(output,18,8) : output;
          res = output._isBigNumber ? output.toString() : output;
        }

        break;
      // case "ethereum:call":
      default:
        this.debug && console.log('skipped, type "' + dataNodeName + '" not described. ');
    }

    return res;
  }

  // async render(wrapper, props, cardName = '', cardType = '', cardView = ''): Promise<any>{
  // async render(subject, props, cardName = '', cardType = '', cardView = '', returnHistory = true, listenNewEvents = true): Promise<any>{
  async render({props, cardName, cardType, cardView, listener }): Promise<any>{
    // console.log('render ' +cardName+ ' ' +cardType+ ' ' + cardView);
    // console.log(JSON.stringify(props));

    // console.log('render ' +cardName+ ' ' +cardType+ '' + cardView);

    const iframeId = cardName + '_' + cardType + '_' + cardView;

    // let iframeDoc;
    const iframe = this.iframes[iframeId];
    this.returnCardFromIframe(props, listener, iframe, iframeId);

  }

  returnCardFromIframe(props, listener, iframe, iframeId): void{
    (this.debug > 2) && console.log('props, listener, iframe');
    (this.debug > 2) && console.log(props);
    // (this.debug > 2) && console.log(iframeId);
    const propsForRender = {};
    for (const [name, value] of Object.entries(props)){
      if ((name === 'value' || name === 'amount') && props.decimals) {
        const decimals = props.decimals;
        let s = value.toString().padStart(decimals, '0');

        if (s.length <= decimals) {
          s = s.padStart(decimals + 1, '0');
        }

        propsForRender[name] = s.substr(0, s.length - decimals)
          + '.' + s.substr(s.length - decimals);

      } else {
        propsForRender[name] = value;
      }
    }

    if (iframe.contentWindow.web3.tokens.dataChanged){
      iframe.contentWindow.web3.tokens.data.currentInstance = propsForRender;
      iframe.contentWindow.web3.tokens.dataChanged(null, {currentInstance: propsForRender}, 'render' );
    }
    const iframeDoc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
    const main = iframeDoc.querySelector('body .main');
    (this.debug > 2) && console.log('main iframe div');
    (this.debug > 2) && console.log(main);
    if (iframeId === 'received_activity_item-view') {
      const output: ApprovedForLiquidityPool = {
        card: main ? main.innerHTML : '',
        amount: props.value,
        ownerAddress: props.ownerAddress,
        transactionNonce: props.nonce,
        transactionSender: '',
        blockHeight: 12,
        timeStamp: null,
      };
      listener.next(output);
    } else {
      main && listener.next(main.innerHTML);
    }
  }

  // async getCardItems(cardName = '', cardType = '', cardView = '', returnHistory = true, listenNewEvents = true): Promise<any> {
  async getCardItems({cardName, cardType, cardView, returnHistory = true, listenNewEvents = true, listener$, transactionNonce = null}): Promise<any> {
    console.log('getCardItems fired');
    let selector = '/ts:token/ts:cards/ts:card';
    if (cardName) {
      selector += '[@name="' + cardName + '"]';
    }
    if (cardType) {
      selector += '[@type="' + cardType + '"]';
    }

    const cardNode = getXMLItem(this.xmlDoc, selector );
    if (!cardNode) {
      console.log('cant see card for >>>' + selector + '<<<');
      return;
      // this.debug && console.log('cant see card for >>>' + selector + '<<<');
    }

    selector = 'ts:origins/ethereum:event';
    const originsNodes = this.xmlDoc.evaluate(selector, cardNode, this.nsResolver, XPathResult.ANY_TYPE, null );
    if (originsNodes && cardType === 'activity') {
      console.log('its activity node');
      const props = Object.assign({}, this.props);
      let ethereumEventNode;
      // tslint:disable-next-line:no-conditional-assignment
      while (originsNodes && (ethereumEventNode = originsNodes.iterateNext() ) ) {

        // this.debug && console.log('ethereumEventNode');
        // this.debug && console.log(ethereumEventNode);
        // ------------------------
        // ethereum:event
        const eventFilter = ethereumEventNode.getAttribute('filter');
        const eventType = ethereumEventNode.getAttribute('type');
        let ethContract = ethereumEventNode.getAttribute('contract');
        ethContract = ethContract ? ethContract : this.defaultContract;

        // tslint:disable-next-line:prefer-const
        let { contractInterface, contractAddress } = getContractAddress(this.xmlDoc, ethContract, this.ethersData.chainID);

        if (!contractAddress) {
          this.debug && console.log('Contract address required. chainID = ' + this.ethersData.chainID + ', lets try to use prop[contract] value.');
          // throw new Error('Contract address required. chainID = '+this.ethersData.chainID);
          contractAddress = props[ethContract];
        }

        if (!ethContract || !contractAddress) { throw new Error(' ethContract and contractAddress required for {Address=' + this.ethersData.userAddress + ', chainID = ' + this.ethersData.chainID + ' , tokenName = ' + this.tokenName + '}. Check logs for details'); }

        const params = getErc20EventParams(eventType, this.xmlDoc);
        // console.log('params');
        // console.log(params);

        if (!params) { throw  new Error(eventType + ' parameters missing.'); }

        const match = eventFilter.match(/(\S+)=(\S+)/);

        if (match) {
          const paramName = match[1];
          const paramValue = match[2];
          if (paramName in params) {
            params[paramName] = paramValue === '${ownerAddress}' ? this.ethersData.userAddress : paramValue;
          }
        }

        const paramsArray = [];
        // tslint:disable-next-line:forin
        for (const i in params){
          paramsArray.push(params[i]);
        }
        this.debug && console.log('eventType');
        this.debug && console.log(eventType);

        this.debug && console.log('params');
        this.debug && console.log(params);

        // let abi = await getJSONAbi(ethContract);
        const [error, abi ] = await to(getJSONAbi(ethContract, this.jsons, this.contractJsonPath, this.debug));
        if (error) { throw new Error(error); }
        if (!abi) { throw new Error('Empty ABI for ' + ethContract); }
        this.jsons[ethContract] = abi;

        const contract = new ethers.Contract(contractAddress, abi, this.ethersData.provider);

        const filter = contract.filters[eventType].apply(null, paramsArray);

        this.debug && console.log('filter');
        this.debug && console.log(filter);

        if (returnHistory) {
          const [contractError, filterResult] = await to(contract.queryFilter(filter) );

          if (contractError) { throw new Error('Error when try to request ' + eventType + ':  ' + contractError); }

          // let activityProps;
          (this.debug  ) && console.log('filterResult for ' + eventType + ', where name=' + cardName + ' and type=' + cardType + ';');
          (this.debug  ) && console.log(filterResult);

          if (filterResult && filterResult.length){
            filterResult.forEach(res => {
              (this.debug > 2 ) && console.log('res.args');
              (this.debug > 2 ) && console.log(JSON.stringify(res.args) );
              (this.debug > 2 ) && console.log(JSON.stringify(props) );
              if (res && res.args){
                const activityProps = filterResultConverter( res.args, props);
                (this.debug > 2 ) && console.log('activityProps');
                (this.debug > 2 ) && console.log(activityProps);
                res.getTransaction().then((transaction) => {
                  activityProps.nonce = transaction.nonce;
                  this.render({props: activityProps, cardName, cardType, cardView, listener: listener$});
                });
              }

            } );
          }
        }

        if (listenNewEvents) {
          contract.on(filter, (src, dst, sum, blockData) => {
            // console.log('Listen Result for '+eventType+ ', where name=' + cardName +' and type='+ cardType + ';');
            // console.log(src,dst,sum,blockData);

            const paramNames = [];
            abi.forEach(method => {
              if (method.name === eventType && method.type === 'event'){
                if (method.inputs.length) { method.inputs.forEach(input => paramNames.push(input.name) ); }
              }
            });
            // console.log('contract.on paramNames');
            // console.log(paramNames);

            // let tokenWrapNode = wrap.closest('.ts_tokenitem_wrap');
            // const tokenWrapNode = wrap.closest('.ts_token_wrap');
            //
            // let tokenIframe = tokenWrapNode.querySelector('iframe');
            // let doc = tokenIframe.contentWindow;
            // let instance = tokenWrapNode.instance;
            // console.log('vars:');
            // console.log(tokenIframe);
            // console.log(doc);
            // console.log(instance);
            // instance.getProps().then(res=>{
            //     doc.web3.tokens.dataChanged(res);
            // })

            // this.runMainDataChanged(wrap);

            if (src && dst && sum){
              const args = {};
              // let paramNames = Object.keys(params);
              args[paramNames[0]] = src;
              args[paramNames[1]] = dst;
              args[paramNames[2]] = sum;
              // console.log('contract.on args');
              // console.log(args);

              const activityProps = filterResultConverter( args, props);
              this.render({props: activityProps, cardName, cardType, cardView, listener: listener$});

              // const togglerNode = tokenWrapNode.querySelector('.sidebar_toggle');
              // const sidebarNode = tokenWrapNode.querySelector('.activity_cards');
              // if (sidebarNode.classList.contains('opened')) { return; }
              //
              // togglerNode.classList.add('has_events');

            }
          });
        }



      }
    } else {
      this.render({props: this.props, cardName, cardType, cardView, listener: listener$ });
    }
  }

  insertScript(doc, inline, src = '', callback = null): void {
    const s = doc.createElement('script');
    const head = doc.querySelector('head');
    s.type = 'text/javascript';
    if (callback) {
      if (s.readyState){  // IE
        s.onreadystatechange = () => {
          if (s.readyState === 'loaded' ||
            s.readyState === 'complete'){
            s.onreadystatechange = null;
            callback();
          }
        };
      } else {  // Others
        s.onload = () => callback();
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
  web3TokensExtention(): void{
    if (!window.web3) {
      window.web3 = {};
    }
    window.web3.tokens = {
      all: [],
      definition: {},
      data: {}
    };
  }
  /*
  method to use it inside iframe to receive and handle inline scripts
   */
  iframeHelper(): void{
    const origin = document.defaultView.location.origin;
    console.log('iframeHelper works');
    // tslint:disable-next-line:typedef
    function is_ethereum_exists(){
      return !!window.ethereum;
    }
    // tslint:disable-next-line:typedef
    function is_web3_exists(){
      return !!window.web3;
    }

  }


  /*
  extract specific value from the result array
   */
  // extractresultValue(func, result, select, abi): number{
  //   let out;
  //   abi.forEach((item) => {
  //     // console.log(item);
  //     if (item.name === func) {
  //       item.outputs.forEach((outputParam, index) => {
  //         if (outputParam.name === select) {
  //           // tsDebug && console.log('parameter found');
  //           out = result[index].toNumber();
  //         }
  //       });
  //     }
  //   });
  //   return out;
  // }
  /*
  replace all "src" sub-strings with "dst"
   */
  replace_all(str, src, dst): string{
    return str.split(src).join(dst);
  }

  decodeHtml(html): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
