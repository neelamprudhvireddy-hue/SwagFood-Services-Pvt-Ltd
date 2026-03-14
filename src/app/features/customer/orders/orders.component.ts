import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '@core/services/order.service';
import { OrderTrackingMapComponent } from '@shared/components/order-tracking-map/order-tracking-map.component';
import { Order, OrderStatus } from '@models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AsyncPipe, NgForOf, DatePipe, RouterLink, OrderTrackingMapComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  readonly orders$;

  constructor(private readonly orderService: OrderService) {
    this.orders$ = this.orderService.orders$;
  }

  timeline(order: Order) {
    return this.orderService.getTimeline(order.status);
  }

  statusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }
}
