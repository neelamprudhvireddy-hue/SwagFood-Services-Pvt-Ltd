import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { GeoPoint, Order } from '@models/order.model';

export interface TrackingUpdate {
  orderId: string;
  driverLocation: GeoPoint;
  distanceText: string;
  etaMinutes: number;
}

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private readonly streams = new Map<string, Subject<TrackingUpdate>>();

  startMockTracking(order: Order): Observable<TrackingUpdate> {
    if (!this.streams.has(order.id)) {
      const subject = new Subject<TrackingUpdate>();
      this.streams.set(order.id, subject);
      this.runSimulation(order, subject);
    }
    return this.streams.get(order.id)!.asObservable();
  }

  private runSimulation(order: Order, sink: Subject<TrackingUpdate>): void {
    const checkpoints: Array<{ offset: GeoPoint; distanceText: string; etaMinutes: number }> = [
      { offset: { lat: 0.0, lng: 0.0 }, distanceText: '4 km away', etaMinutes: 15 },
      { offset: { lat: 0.002, lng: -0.003 }, distanceText: '2 km away', etaMinutes: 10 },
      { offset: { lat: 0.004, lng: -0.006 }, distanceText: '500 m away', etaMinutes: 4 },
      { offset: { lat: 0.005, lng: -0.008 }, distanceText: '100 m away', etaMinutes: 1 },
      { offset: { lat: 0.007, lng: -0.010 }, distanceText: 'Arrived', etaMinutes: 0 },
    ];

    interval(3000)
      .pipe(
        startWith(0),
        take(checkpoints.length),
        map((step) => checkpoints[step]),
      )
      .subscribe({
        next: (checkpoint) => {
          sink.next({
            orderId: order.id,
            driverLocation: {
              lat: order.restaurantLocation.lat + checkpoint.offset.lat,
              lng: order.restaurantLocation.lng + checkpoint.offset.lng,
            },
            distanceText: checkpoint.distanceText,
            etaMinutes: checkpoint.etaMinutes,
          });
        },
        complete: () => sink.complete(),
      });
  }
}

