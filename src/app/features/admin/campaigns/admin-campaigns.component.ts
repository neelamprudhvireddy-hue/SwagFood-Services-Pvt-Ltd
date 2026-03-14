import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-admin-campaigns',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, DecimalPipe],
  templateUrl: './admin-campaigns.component.html',
  styleUrl: './admin-campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCampaignsComponent {
  private readonly analyticsService = inject(AnalyticsService);
  readonly campaigns$ = this.analyticsService.getCampaigns();
}
