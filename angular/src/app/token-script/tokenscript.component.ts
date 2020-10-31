import { Component, OnInit, OnDestroy } from '@angular/core';

import { TsaService } from '../tsa.service';
import { Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-tsa',
  templateUrl: './tokenscript.component.html',
  styleUrls: ['./tokenscript.component.scss']
})
export class TsaComponent implements OnInit, OnDestroy {

  tokens: string[] = [];
  tokensSubject: Subject<any>;
  config: any;
  debug = true;

  barOpened = false;

  constructor(private tsaService: TsaService) {}

  barHeadToggler(): void{
    this.barOpened = !this.barOpened;
  }

  ngOnInit(): void {
    this.tokensSubject = this.tsaService.listenTokens();
    this.tokensSubject.subscribe(tokens => {
      this.tokens = tokens;
      console.log('tokens');
      console.log(tokens);
      Object.keys(tokens).forEach(tokenName => {
        const ids = Object.keys(tokens[tokenName]);
        if (ids.length) {
          ids.forEach(id => {
            // console.log('ids');
            // console.log(id);
            const listener = new Subject();
            listener.subscribe(card => {
              // console.log('card received');
              // console.log(card);
            } );
            this.tsaService.renderCards({
              listener,
              tokenName,
              tokenInstance: id,
              cardName: 'sent',
              // cardName: 'received',
              cardType: 'activity',
              cardView: 'item-view',
              returnHistory: true,
              listenNewEvents: true,
              transactionNonce: null
            });
          });
        }
      });

    });
    this.addTokensFiles();
  }

  ngOnDestroy(): void{
    this.tokensSubject.unsubscribe();
  }

  addTokensFiles(): void {
    const files = [
      'assets/LiquidityPoolShare.xml',
      // 'assets/BOOKY.xml',
      // 'assets/MiningPoolShare.xml',
      // 'assets/COFI.xml'
    ];
    for (const path of files){
      this.tsaService.negotiateTokenByPath(path);
    }
  }
}
