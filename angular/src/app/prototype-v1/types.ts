export interface EthersData {
  provider: any;
  signer: any;
  userAddress: string;
  chainID: string;
}

export interface EthereumCallParams {
  params: [any];
  ethCallAttributtes: {contract?: string, function?: string};
}

export interface ContractAddress {
  contractAddress: string;
  contractInterface?: string;
}

export interface ERC20Props {
  decimals?: number;
  ownerBalance?: number;
  tokenId?: string;
}

import { BigNumber } from '@ethersproject/bignumber';

// just some dummy interface for poc
export interface Dummy {
  value1: BigNumber;
  value2: BigNumber;
  value3: BigNumber;
}

// ref: https://docs.google.com/document/d/1w-fgGhoc8XReYRNgLjcVrxjtVCYVq-SlGRfJoQgNbA0
/** */
export interface LiquidityPoolShare {
  pairSymbol: string;
  pair: string;
  balance: BigNumber;
  pairedTokenAllowance: BigNumber;
  totalSupply: BigNumber;
  navPerShare: BigNumber;
  navPerShareSubscription: BigNumber;
  navPerShareRedemption: BigNumber;
}

export interface MiningPoolShare {
  pairSymbol: string;
  pair: string;
  balance: BigNumber;
  poolSize: BigNumber;
  miningAllowance: BigNumber;
  cofiMiningRate: BigNumber;
  cofiTotalClaimed: BigNumber;
  cofiClaimable: BigNumber;
}

export interface Activity {
  transactionNonce: string; // ? 32 bytes
  transactionSender: string; // ? 20 bytes
  blockHeight: number;
  timeStamp: Date;
  card?: any;
}

export interface ApprovedForLiquidityPool extends Activity {
  amount: BigNumber;
  ownerAddress: string;
}

export interface ApprovedForMiningPool extends Activity {
  amount: BigNumber;
  ownerAddress: string;
}

export interface DepositedForMiningPool extends Activity {
  amount: BigNumber;
  depositorAddress: string;
}

export interface WithdrewFromMiningPool extends Activity {
  amount: BigNumber;
  ownerAddress: string;
}

export interface WithdrewFromLiquidityPool extends Activity {
  amount: BigNumber;
  pairTokenSymbol: string;
  beneficiaryAddress: string;
}

export interface Token {
  LiquidityPoolShare: {
    [key: string]: LiquidityPoolShare;
  };
  MiningPoolShare: {
    [key: string]: MiningPoolShare;
  };
  CoFi: [];
}

export interface СofiToken {
  balance: BigNumber;
  totalSupply: BigNumber;
}

export interface DividendPoolShare {
  balance: BigNumber;
  cofiAllowance: BigNumber;
  poolSize: BigNumber;
  poolEthBalance: BigNumber;
  revenueDistributionToDividend: number;
  shareInDividendPool: number;
  ethTotalClaimed: BigNumber;
}

// https://www.typescriptlang.org/docs/handbook/literal-types.html
// this technique improving a typesafity around use-cases like that
export const PairSymbol = ['ETH/USDT', 'ETC/HBTC'] as const;
export type PairSymbol = typeof PairSymbol[number];
