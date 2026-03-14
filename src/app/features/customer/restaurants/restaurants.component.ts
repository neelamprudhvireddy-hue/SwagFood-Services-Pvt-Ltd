import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Restaurant } from '@models/restaurant.model';
import {
  RestaurantFilterOptions,
  RestaurantService,
  RestaurantSort,
} from '@core/services/restaurant.service';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { CuisineFilterComponent } from '@shared/components/cuisine-filter/cuisine-filter.component';
import { RestaurantCardComponent } from '@shared/components/restaurant-card/restaurant-card.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    SearchBarComponent,
    CuisineFilterComponent,
    RestaurantCardComponent,
    SkeletonLoaderComponent,
  ],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.scss',
})
export class RestaurantsComponent implements OnInit {
  readonly cuisines$: Observable<string[]>;
  readonly restaurants$: Observable<Restaurant[]>;
  readonly filters$ = new BehaviorSubject<RestaurantFilterOptions>({
    searchTerm: '',
    cuisines: [],
    minRating: 0,
    sortBy: 'rating',
  });

  readonly sortOptions: { label: string; value: RestaurantSort }[] = [
    { label: 'Rating', value: 'rating' },
    { label: 'Fastest', value: 'fastest' },
    { label: 'Budget friendly', value: 'cost' },
  ];

  minRating = 0;

  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly route: ActivatedRoute,
  ) {
    this.cuisines$ = this.restaurantService.getCuisines();
    this.restaurants$ = this.filters$.pipe(
      switchMap((filters) => this.restaurantService.filter(filters)),
    );
  }

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('q');
    if (query) {
      this.updateFilters({ searchTerm: query });
    }
  }

  handleSearch(query: string): void {
    this.updateFilters({ searchTerm: query });
  }

  handleCuisineChange(selection: string[]): void {
    this.updateFilters({ cuisines: selection });
  }

  updateSort(sortBy: RestaurantSort): void {
    this.updateFilters({ sortBy });
  }

  updateRating(rating: number): void {
    this.minRating = rating;
    this.updateFilters({ minRating: rating });
  }

  private updateFilters(partial: Partial<RestaurantFilterOptions>): void {
    this.filters$.next({ ...this.filters$.value, ...partial });
  }
}
