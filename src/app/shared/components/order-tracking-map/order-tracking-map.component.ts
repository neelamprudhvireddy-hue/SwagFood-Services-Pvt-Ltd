import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoPoint } from '@models/order.model';

@Component({
  selector: 'app-order-tracking-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-tracking-map.component.html',
  styleUrl: './order-tracking-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackingMapComponent {
  @Input({ required: true }) restaurant!: GeoPoint;
  @Input({ required: true }) customer!: GeoPoint;
  @Input({ required: true }) driver!: GeoPoint;
  @Input() distanceText = '';
  @Input() etaMinutes = 0;
}

