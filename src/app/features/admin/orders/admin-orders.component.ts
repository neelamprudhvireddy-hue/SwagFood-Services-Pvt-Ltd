import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { OrderService } from '@core/services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, DatePipe, DecimalPipe],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersComponent {
  private readonly orderService = inject(OrderService);
  readonly orders$ = this.orderService.orders$;
}
