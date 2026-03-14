import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';
import { OrderService } from '@core/services/order.service';

interface PayoutRow {
  restaurantName: string;
  orders: number;
  amountDue: number;
}

@Component({
  selector: 'app-admin-payouts',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, CurrencyPipe],
  templateUrl: './admin-payouts.component.html',
  styleUrl: './admin-payouts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPayoutsComponent {
  private readonly orderService = inject(OrderService);
  readonly payouts$ = this.orderService.orders$.pipe(
    map((orders) => {
      const mapByRestaurant = new Map<string, PayoutRow>();
      orders.forEach((order) => {
        const entry = mapByRestaurant.get(order.restaurantId) ?? {
          restaurantName: order.restaurantName,
          orders: 0,
          amountDue: 0,
        };
        entry.orders += 1;
        entry.amountDue += order.totalAmount * 0.85; // simulate commission
        mapByRestaurant.set(order.restaurantId, entry);
      });
      return Array.from(mapByRestaurant.values());
    }),
  );
}
