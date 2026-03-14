import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RestaurantService } from '@core/services/restaurant.service';
import { RestaurantCardComponent } from '@shared/components/restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgForOf, RestaurantCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  readonly favorites$;

  constructor(private readonly restaurantService: RestaurantService) {
    this.favorites$ = this.restaurantService.getFavorites();
  }
}
