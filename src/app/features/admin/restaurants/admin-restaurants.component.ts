import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '@core/services/restaurant.service';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [AsyncPipe, NgForOf, RouterLink, CurrencyPipe, DecimalPipe, NgIf],
  templateUrl: './admin-restaurants.component.html',
  styleUrl: './admin-restaurants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRestaurantsComponent {
  private readonly restaurantService = inject(RestaurantService);
  readonly restaurants$ = this.restaurantService.restaurants$;
}
