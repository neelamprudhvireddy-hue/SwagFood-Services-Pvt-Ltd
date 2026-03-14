import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgForOf, NgIf, SlicePipe } from '@angular/common';
import { OrderService } from '@core/services/order.service';
import { OrderStatus } from '@models/order.model';

@Component({
  selector: 'app-worker-orders',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, DecimalPipe, SlicePipe],
  templateUrl: './worker-orders.component.html',
  styleUrl: './worker-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerOrdersComponent {
  private readonly orderService = inject(OrderService);
  readonly orders$ = this.orderService.orders$;
  readonly pipeline = this.orderService.statusFlow;

  nextStatuses(status: OrderStatus): OrderStatus[] {
    const index = this.pipeline.indexOf(status);
    return index === -1 ? [] : this.pipeline.slice(index + 1);
  }

  setStatus(orderId: string, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe();
  }

  statusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }
}
