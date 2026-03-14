import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-manager-staff',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf],
  templateUrl: './manager-staff.component.html',
  styleUrl: './manager-staff.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerStaffComponent {
  private readonly analyticsService = inject(AnalyticsService);
  readonly staff$ = this.analyticsService.getStaffRoster();
}
