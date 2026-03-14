import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';
import { AnalyticsChartComponent } from '@shared/components/analytics-chart/analytics-chart.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, DecimalPipe, AnalyticsChartComponent],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAnalyticsComponent {
  private readonly analyticsService = inject(AnalyticsService);

  readonly metrics$ = this.analyticsService.getAdminMetrics();
  readonly ordersPerDay$ = this.analyticsService.getOrdersPerDay();
  readonly revenuePerMonth$ = this.analyticsService.getRevenuePerMonth();
  readonly topRestaurants$ = this.analyticsService.getTopRestaurants(5);
  readonly topItems$ = this.analyticsService.getTopItems(5);
  readonly deliveryPerformance$ = this.analyticsService.getDeliveryPerformance();
}
