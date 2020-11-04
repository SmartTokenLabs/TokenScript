import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApprovedForLiquidityPool } from '../prototype-v1/types';

const initialState: ApprovedForLiquidityPool = null;

@Injectable({
  providedIn: 'root',
})
export class ActivityCardService {
  private data$ = new BehaviorSubject<ApprovedForLiquidityPool>(initialState);
  state$ = this.data$.asObservable();

  constructor() {}

  public setCard(value): void {
    const currentData = this.data$.getValue();
    this.data$.next({ ...currentData, ...value });
  }
}
