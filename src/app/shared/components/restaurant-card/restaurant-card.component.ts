import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Restaurant } from '@models/restaurant.model';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { RestaurantService } from '@core/services/restaurant.service';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [RouterLink, RatingStarsComponent, NgForOf],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.scss',
})
export class RestaurantCardComponent {
  @Input({ required: true }) restaurant!: Restaurant;

  constructor(private readonly restaurantService: RestaurantService) {}

  toggleFavorite(event: MouseEvent): void {
    event.preventDefault();
    this.restaurantService.toggleFavorite(this.restaurant.id);
  }
}
