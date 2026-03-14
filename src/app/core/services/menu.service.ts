import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MenuItem } from '@models/menu-item.model';
import { mockMenuItems } from '@core/data/mock-menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  readonly menuItems$ = this.menuItemsSubject.asObservable();

  constructor() {
    this.loadMenu();
  }

  private loadMenu(): void {
    of(mockMenuItems)
      .pipe(delay(400))
      .subscribe({
        next: (items) => this.menuItemsSubject.next(items),
      });
  }

  getMenuByRestaurant(restaurantId: string): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map((items) => items.filter((item) => item.restaurantId === restaurantId)),
    );
  }

  getHighlightedItems(limit = 6): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map((items) =>
        items
          .slice()
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit),
      ),
    );
  }

  getMenuItem(menuItemId: string): MenuItem | undefined {
    return this.menuItemsSubject.value.find((item) => item.id === menuItemId);
  }
}
