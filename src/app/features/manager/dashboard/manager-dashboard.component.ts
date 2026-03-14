import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [NgForOf, AsyncPipe],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent {
  private readonly analyticsService = inject(AnalyticsService);
  readonly cards$ = this.analyticsService.getManagerInsights();
}
