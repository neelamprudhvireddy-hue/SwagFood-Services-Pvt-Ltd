import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { RestaurantCardComponent } from '@shared/components/restaurant-card/restaurant-card.component';
import { MenuItemCardComponent } from '@shared/components/menu-item-card/menu-item-card.component';
import { RestaurantService } from '@core/services/restaurant.service';
import { MenuService } from '@core/services/menu.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    SearchBarComponent,
    RestaurantCardComponent,
    MenuItemCardComponent,
    SkeletonLoaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly restaurantService = inject(RestaurantService);
  private readonly menuService = inject(MenuService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);

  readonly featuredRestaurants$ = this.restaurantService.getFeatured(4);
  readonly trendingDishes$ = this.menuService.getHighlightedItems(4);
  readonly metrics$ = this.analyticsService.getConsumerKeyStats();

  handleSearch(query: string): void {
    this.router.navigate(['/restaurants'], { queryParams: { q: query } });
  }
}
