import { Injectable } from '@angular/core';
import { BigNumber } from '@ethersproject/bignumber';
import { Observable } from 'rxjs';
import { TsaService } from './tsa.service';
import {
  Activity,
  ApprovedForLiquidityPool,

  ApprovedForMiningPool,

  DepositedForMiningPool,
  LiquidityPoolShare,
  Token,
  WithdrewFromLiquidityPool,
  WithdrewFromMiningPool
} from './types';

@Injectable({
  providedIn: 'root',
})
export class HuAndHuService {
  constructor(private oleg: TsaService) {}

  /**
   * @description Connects with a wallet
   * @returns fake data
   */
  public connect(): Observable<Token> {
    return this.oleg.negotiateToken();
  }

  public renderView(modal: any): any {
    this.oleg.renderView(modal);
  }

  /**
   * @description Approve to add to Liquidity Pool
   * @returns dummy Approved Activity
   */
  public activityApproval(
    token: LiquidityPoolShare,
    amount: BigNumber
  ): Observable<ApprovedForLiquidityPool> {
    // create a transaction and return transaction Id (currently dummy Id)
    // then returns observable activity that should be there if the transaction
    // is successflu. TODO if not Approved then UI has to know it

    // MAGIC happens here that makes the BigNumber in to payload
    const payload = `abc${amount}`;

    /// magic happens here a transaction is created for contract token.pair
    /// with payload 'abc', and sent to the node
    const contract = token.pair;
    const transactionHash = '0x80830482098402840932'; // transaction made to contract
    const transactionNonce = 12; // this is obtained from the wallet/metamask
    const activityCardName = 'sent';
    // card type always activity
    // const cardType = 'activity'; // name of activity expected if the tx did its job
    // get an activity
    return this.getActivityCard<ApprovedForLiquidityPool>(
      token,
      activityCardName,
      transactionNonce,
      'ApprovedForLiquidityPool'
    );
  }

  public approveForMining(
    token: LiquidityPoolShare,
    amount: BigNumber
  ): Observable<ApprovedForMiningPool> {
    const payload = `abc${amount}`;

    const contract = token.pair;
    const transactionHash = '0x80830482098402840932';
    const transactionNonce = 12;
    const activityCardName = 'sent';

    return this.getActivityCard<ApprovedForMiningPool>(
      token,
      activityCardName,
      transactionNonce,
      'ApprovedForMiningPool'
    );
  }

  public liquidityPoolDeposit(
    token: LiquidityPoolShare,
    amount: BigNumber
  ): Observable<DepositedForMiningPool> {
    const payload = `abc${amount}`;

    const contract = token.pair;
    const transactionHash = '0x80830482098402840932'; // transaction made to contract
    const transactionNonce = 12; // this is obtained from the wallet/metamask
    const activityCardName = 'deposited';

    return this.getActivityCard<DepositedForMiningPool>(
      token,
      activityCardName,
      transactionNonce,
      'DepositedForMiningPool'
    );
  }

  public miningPoolDeposit(
    token: LiquidityPoolShare,
    amount: BigNumber
  ): Observable<WithdrewFromMiningPool> {
    const payload = `abc${amount}`;

    const contract = token.pair;
    const transactionHash = '0x80830482098402840932'; // transaction made to contract
    const transactionNonce = 12; // this is obtained from the wallet/metamask
    const activityCardName = 'deposited';

    return this.getActivityCard<WithdrewFromMiningPool>(
      token,
      activityCardName,
      transactionNonce,
      'WithdrewFromMiningPool'
    );
  }

  public liquidityPoolWithdraw(
    token: LiquidityPoolShare,
    ethAmount: BigNumber,
    pairAmount: BigNumber
  ): Observable<WithdrewFromLiquidityPool> {
    // MAGIC 2 happen here that creates a transaction

    const payload = `abc${ethAmount}${pairAmount}`;
    const contract = token.pair;
    const transactionHash = '0x80830482098402840932'; // transaction made to contract˜
    const transactionNonce = 12; // this is obtained from the wallet/metamask
    const activityCardName = 'withdraw';

    return this.getActivityCard<WithdrewFromLiquidityPool>(
      token,
      activityCardName,
      transactionNonce,
      'WithdrewFromLiquidityPool'
    );
  }

  public getActivityCard<T extends Activity>(
    token: LiquidityPoolShare,
    activityType: string,
    transactionNonce: number,
    returnType: string
  ): Observable<T> {
    return this.oleg.getCard<T>(
      token,
      activityType,
      transactionNonce,
      returnType
    );
  }
}
