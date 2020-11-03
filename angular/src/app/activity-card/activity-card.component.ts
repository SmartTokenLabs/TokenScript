import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovedForLiquidityPool } from '../prototype-v1/types';
import { ActivityCardService } from './activity-card.service';

@Component({
  selector: 'app-activity-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {
  value$: Observable<ApprovedForLiquidityPool>;
  constructor(private activityCard: ActivityCardService) {}

  ngOnInit(): void {
    this.value$ = this.activityCard.state$;
  }
}
