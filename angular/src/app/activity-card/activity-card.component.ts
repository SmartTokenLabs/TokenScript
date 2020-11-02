import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { ApprovedForLiquidityPool } from '../prototype-v1/types';

@Component({
  selector: 'app-activity-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit {

  @Input() card: ApprovedForLiquidityPool;

  constructor() { }

  ngOnInit(): void {
  }

}
