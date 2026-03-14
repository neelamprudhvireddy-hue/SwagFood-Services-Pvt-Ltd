import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgForOf, AsyncPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);
  readonly metrics$ = this.analyticsService.getAdminMetrics();
  readonly quickLinks$ = this.analyticsService.getAdminQuickLinks();

  open(path: string): void {
    this.router.navigateByUrl(path);
  }
}
