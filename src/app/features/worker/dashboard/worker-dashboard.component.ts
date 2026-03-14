import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, SlicePipe } from '@angular/common';
import { OrderService } from '@core/services/order.service';
import { OrderStatus } from '@models/order.model';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [NgForOf, AsyncPipe, SlicePipe],
  templateUrl: './worker-dashboard.component.html',
  styleUrl: './worker-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerDashboardComponent {
  private readonly orderService = inject(OrderService);
  readonly orders$ = this.orderService.orders$;
  readonly statusFlow = this.orderService.statusFlow;

  nextStatuses(current: OrderStatus): OrderStatus[] {
    const index = this.statusFlow.indexOf(current);
    return index === -1 ? [] : this.statusFlow.slice(index + 1);
  }

  updateStatus(orderId: string, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe();
  }

  statusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }
}
