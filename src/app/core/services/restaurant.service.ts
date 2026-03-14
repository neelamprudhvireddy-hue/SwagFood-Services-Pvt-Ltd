import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Restaurant } from '@models/restaurant.model';
import { AuthService } from './auth.service';
import { mockRestaurants } from '@core/data/mock-restaurants';

export type RestaurantSort = 'rating' | 'fastest' | 'cost';

export interface RestaurantFilterOptions {
  searchTerm?: string;
  cuisines?: string[];
  minRating?: number;
  sortBy?: RestaurantSort;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly restaurantsSubject = new BehaviorSubject<Restaurant[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(true);

  readonly loading$ = this.loadingSubject.asObservable();
  readonly restaurants$: Observable<Restaurant[]>;

  constructor(private readonly auth: AuthService) {
    this.restaurants$ = combineLatest([
      this.restaurantsSubject.asObservable(),
      this.auth.user$,
    ]).pipe(
      map(([restaurants, user]) =>
        restaurants.map((restaurant) => ({
          ...restaurant,
          isFavorite: user?.favorites.includes(restaurant.id) ?? false,
        })),
      ),
    );
    this.loadRestaurants();
  }

  private loadRestaurants(): void {
    of(mockRestaurants)
      .pipe(delay(400))
      .subscribe({
        next: (restaurants) => {
          this.restaurantsSubject.next(restaurants);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false),
      });
  }

  getRestaurant(id: string): Observable<Restaurant | undefined> {
    return this.restaurants$.pipe(map((list) => list.find((restaurant) => restaurant.id === id)));
  }

  filter(options: RestaurantFilterOptions): Observable<Restaurant[]> {
    return this.restaurants$.pipe(map((restaurants) => this.applyFilters(restaurants, options)));
  }

  getFeatured(limit = 4): Observable<Restaurant[]> {
    return this.restaurants$.pipe(
      map((restaurants) =>
        restaurants
          .filter((restaurant) => restaurant.promoted)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit),
      ),
    );
  }

  getFavorites(): Observable<Restaurant[]> {
    return combineLatest([this.restaurants$, this.auth.user$]).pipe(
      map(([restaurants, user]) => {
        if (!user) {
          return [];
        }
        return restaurants.filter((restaurant) => user.favorites.includes(restaurant.id));
      }),
    );
  }

  getCuisines(): Observable<string[]> {
    return this.restaurants$.pipe(
      map((restaurants) => Array.from(new Set(restaurants.flatMap((restaurant) => restaurant.cuisines))).sort()),
    );
  }

  toggleFavorite(restaurantId: string): void {
    this.auth.toggleFavorite(restaurantId);
  }

  private applyFilters(restaurants: Restaurant[], options: RestaurantFilterOptions): Restaurant[] {
    const search = options.searchTerm?.trim().toLowerCase() ?? '';
    const cuisineFilters = new Set((options.cuisines ?? []).map((cuisine) => cuisine.toLowerCase()));
    const minRating = options.minRating ?? 0;

    let filtered = restaurants.filter((restaurant) => {
      const matchesSearch =
        !search ||
        restaurant.name.toLowerCase().includes(search) ||
        restaurant.cuisines.some((cuisine) => cuisine.toLowerCase().includes(search));
      const matchesCuisine =
        cuisineFilters.size === 0 ||
        restaurant.cuisines.some((cuisine) => cuisineFilters.has(cuisine.toLowerCase()));
      const matchesRating = restaurant.rating >= minRating;
      return matchesSearch && matchesCuisine && matchesRating;
    });

    const sortBy = options.sortBy ?? 'rating';
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'fastest') {
        return this.getDeliveryMinutes(a.deliveryTime) - this.getDeliveryMinutes(b.deliveryTime);
      }
      return a.costForTwo - b.costForTwo;
    });

    return filtered;
  }

  private getDeliveryMinutes(timeRange: string): number {
    const minutes = parseInt(timeRange, 10);
    return Number.isNaN(minutes) ? 30 : minutes;
  }
}
