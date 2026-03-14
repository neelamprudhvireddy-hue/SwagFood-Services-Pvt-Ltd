import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { RestaurantService } from '@core/services/restaurant.service';
import { MenuService } from '@core/services/menu.service';
import { RatingStarsComponent } from '@shared/components/rating-stars/rating-stars.component';
import { MenuItemCardComponent } from '@shared/components/menu-item-card/menu-item-card.component';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    RouterLink,
    RatingStarsComponent,
    MenuItemCardComponent,
  ],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.scss',
})
export class RestaurantDetailComponent {
  readonly restaurant$;
  readonly signatureMenu$;

  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly menuService: MenuService,
    private readonly route: ActivatedRoute,
  ) {
    this.restaurant$ = this.route.paramMap.pipe(
      switchMap((params) => this.restaurantService.getRestaurant(params.get('id') ?? '')),
    );

    this.signatureMenu$ = this.route.paramMap.pipe(
      switchMap((params) => this.menuService.getMenuByRestaurant(params.get('id') ?? '')),
      map((items) => items.slice(0, 4)),
    );
  }
}
