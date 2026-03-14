import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { OrderService } from '@core/services/order.service';
import { OrderTrackingMapComponent } from '@shared/components/order-tracking-map/order-tracking-map.component';
import { OrderStatus } from '@models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgForOf, OrderTrackingMapComponent],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackingComponent {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  readonly order$ = this.route.paramMap.pipe(
    switchMap((params) => this.orderService.getOrderById(params.get('orderId') ?? '')),
  );

  steps(status: OrderStatus) {
    return this.orderService.getTimeline(status);
  }
}
