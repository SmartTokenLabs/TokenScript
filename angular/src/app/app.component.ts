import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BigNumber } from '@ethersproject/bignumber';
import { tap } from 'rxjs/operators';
import { HuAndHuService } from './prototype-v1/hu-and-hu.service';
import { LiquidityPoolShare } from './prototype-v1/types';
import { random, uuidv4 } from './utility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'token-api-poc';

  constructor(private huAndHu: HuAndHuService) {
    this.runV1();
  }

  /**
   * @description THIS IS EXAMPLES FOR PROTOTYPE V1 (see prototype-v1 folder)
   */
  private runV1(): void {
    let tabsCreated = false;
    this.huAndHu
      .connect()
      .pipe(
        // this side effect will be executed only for the first emission
        tap((tokens) => {
          if (!tabsCreated) {
            console.log(tokens);
            this.createTabs(tokens.LiquidityPoolShare); // observe log
            // tabsCreated = true;
          }
        })
      )
      .subscribe((tokens) => {
        if (Object.keys(tokens).length) {
          this.getActivities();
        }
        // for the current user, presently there are 2
        // LiquidityPoolShare tokens as currently there are 2 pools.

        // If the user never deposited to a pool, the token that
        // represents his/her share still exists, albeit with 0
        // balance and filter 'undefined' values
        for (const [key, value] of Object.entries(tokens).filter(
          (x) => x[1] !== undefined
        )) {
          Object.values(value).forEach((val: LiquidityPoolShare) => {
            console.log(val.balance); // should log a BigNumber object once a few seconds
          });
        }
        // you can also do this to get the 2 MiningPoolShare tokens
        // tokens.MiningPoolShare.forEach…
      });

    // hard code the dummy token - code above already showed how to
    // get a token but this dummy is set up to demonstrate how to
    // follow up a transaction with anticipated activity (event
    // specific to the current token)




  }
  private getActivities(): void{
    const dummyToken = {
      pairSymbol: 'USDT',
      pair: uuidv4(),
      balance: BigNumber.from(random(1, 100)),
      pairedTokenAllowance: BigNumber.from(1),
      totalSupply: BigNumber.from(1),
      navPerShare: BigNumber.from(1),
      navPerShareSubscription: BigNumber.from(1),
      navPerShareRedemption: BigNumber.from(1),
    };
    // subscribe for Activity after sending transaction to know
    // if the effect of the transaction is as expected
    // (just knowing the transaction is successfully executed is not enough
    // for example you need to learn the actual price used in the transaction
    // which would be in the properties of the corrisponding Activity)
    this.huAndHu
      .activityApproval(dummyToken, BigNumber.from(1)) // build+send transaction
      .subscribe((activity) => {
        console.log('Card: ApprovedForLiquidityPool');
        console.log(activity);

        // if this code is running, the approve must be successful
        // TODO capture the 'missing-desired-activity' error

        if (activity.amount > BigNumber.from(0)) {
          let modal;
          // check if the approved amount is the one we set
          if (activity.amount === BigNumber.from(Math.max)) {
            // the wanted amount is approved

            // make a modal dialogue which has a title "Fully Approved"
            modal = this.renderModal();
          } else {
            // well, at least some are approved "Partially Approved"
            modal = this.renderModal();
          }
          // do some fireworks here
          // then, render the activity
          this.huAndHu.renderView(modal);
          // then, make the modal appear
        } else {
          // do not display fireworks.
        }
      });

    this.huAndHu
      .approveForMining(dummyToken, BigNumber.from(1))
      .subscribe((activity) => {
        console.log('Card: ApprovedForMiningPool');
        console.log(activity);
      });

    this.huAndHu
      .liquidityPoolDeposit(dummyToken, BigNumber.from(1))
      .subscribe((activity) => {
        console.log('Card: DepositedForMiningPool');
        console.log(activity);
      });

    this.huAndHu
      .miningPoolDeposit(dummyToken, BigNumber.from(1))
      .subscribe((activity) => {
        console.log('Card: WithdrewFromMiningPool');
        console.log(activity);
      });

    this.huAndHu
      .liquidityPoolWithdraw(dummyToken, BigNumber.from(1), BigNumber.from(2))
      .subscribe((activity) => {
        console.log('Card: WithdrewFromLiquidityPool');
        console.log(activity);
      });
  }

  private renderModal(): void {}

  private createTabs(item: { [key: string]: LiquidityPoolShare }): void {
    // here do the UI of pool tab
    // make a tab for this pool
    // pool header is
    if (!item) {
      return;
    }
    console.log('create tabs');
    for (const [key, value] of Object.entries(item)) {
      console.log(`ETH/${value.pairSymbol}`);
    }
  }

  /**
   * @description THIS IS EXAMPLE FOR PROTOTYPE v0 - it is not a use-case at the moment.
   * In order to run the samples inject the instance of TokenService
   */
  private runV0(): void {
    // get token instances
    // this.tokenService.connect().subscribe(console.log);
    // get balance
    // this.tokenService.getBalanceInLiquidityPool().subscribe(console.log);
    // add funds and get Approved Activity
    // this.tokenService.addFundsToLiquidityPool().subscribe(console.log);
  }
}
