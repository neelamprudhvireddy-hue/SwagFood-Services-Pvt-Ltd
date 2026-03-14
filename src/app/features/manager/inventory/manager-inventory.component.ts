import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { RestaurantService } from '@core/services/restaurant.service';
import { MenuService } from '@core/services/menu.service';

interface InventoryRow {
  restaurantName: string;
  skuCount: number;
  highDemand: number;
}

@Component({
  selector: 'app-manager-inventory',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf],
  templateUrl: './manager-inventory.component.html',
  styleUrl: './manager-inventory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerInventoryComponent {
  private readonly restaurantService = inject(RestaurantService);
  private readonly menuService = inject(MenuService);

  readonly inventory$ = combineLatest([
    this.restaurantService.restaurants$,
    this.menuService.menuItems$,
  ]).pipe(
    map(([restaurants, menuItems]) =>
      restaurants.map<InventoryRow>((restaurant) => {
        const items = menuItems.filter((item) => item.restaurantId === restaurant.id);
        return {
          restaurantName: restaurant.name,
          skuCount: items.length,
          highDemand: items.filter((item) => item.rating >= 4.5).length,
        };
      }),
    ),
  );
}
