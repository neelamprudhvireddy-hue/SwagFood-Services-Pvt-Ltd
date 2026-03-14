import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { RestaurantService } from '@core/services/restaurant.service';
import { MenuService } from '@core/services/menu.service';
import { MenuItem } from '@models/menu-item.model';
import { MenuItemCardComponent } from '@shared/components/menu-item-card/menu-item-card.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

interface MenuFilters {
  category: string;
  vegOnly: boolean;
}

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, MenuItemCardComponent, LoadingSpinnerComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  protected readonly filters$ = new BehaviorSubject<MenuFilters>({
    category: 'All',
    vegOnly: false,
  });

  readonly restaurant$;
  readonly rawMenuItems$;
  readonly menuItems$;
  readonly categories$;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly restaurantService: RestaurantService,
    private readonly menuService: MenuService,
  ) {
    this.restaurant$ = this.route.paramMap.pipe(
      switchMap((params) => this.restaurantService.getRestaurant(params.get('restaurantId') ?? '')),
    );

    this.rawMenuItems$ = this.route.paramMap.pipe(
      switchMap((params) => this.menuService.getMenuByRestaurant(params.get('restaurantId') ?? '')),
    );

    this.menuItems$ = combineLatest([this.rawMenuItems$, this.filters$]).pipe(
      map(([items, filters]) => this.applyFilters(items, filters)),
    );

    this.categories$ = this.rawMenuItems$.pipe(
      map((items) => ['All', ...Array.from(new Set(items.map((item) => item.category)))]),
    );
  }

  toggleVeg(vegOnly: boolean): void {
    this.filters$.next({ ...this.filters$.value, vegOnly });
  }

  selectCategory(category: string): void {
    this.filters$.next({ ...this.filters$.value, category });
  }

  private applyFilters(items: MenuItem[], filters: MenuFilters): MenuItem[] {
    return items.filter((item) => {
      const matchesCategory = filters.category === 'All' || item.category === filters.category;
      const matchesVeg = !filters.vegOnly || item.isVeg;
      return matchesCategory && matchesVeg;
    });
  }
}
