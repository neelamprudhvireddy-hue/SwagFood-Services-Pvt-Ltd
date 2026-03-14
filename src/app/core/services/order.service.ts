import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CartItem } from '@models/cart-item.model';
import { GeoPoint, Order, OrderStatus } from '@models/order.model';
import { TrackingService, TrackingUpdate } from './tracking.service';
import { mockOrders } from '@core/data/mock-orders';
import { mockDrivers } from '@core/data/mock-drivers';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);
  readonly orders$ = this.ordersSubject.asObservable();
  private driverPointer = 0;
  readonly statusFlow: ReadonlyArray<OrderStatus> = [
    'PLACED',
    'CONFIRMED',
    'COOKING',
    'PACKING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'NEARBY',
    'ARRIVING',
    'DELIVERED',
  ];
  private readonly trackingStatusMap: Record<string, OrderStatus> = {
    '4 km away': 'OUT_FOR_DELIVERY',
    '2 km away': 'OUT_FOR_DELIVERY',
    '500 m away': 'NEARBY',
    '100 m away': 'ARRIVING',
    Arrived: 'DELIVERED',
  };
  private readonly notifiedStatuses = new Map<string, Set<OrderStatus>>();
  private readonly statusMessages: Partial<Record<OrderStatus, string>> = {
    PLACED: 'Order placed successfully',
    COOKING: 'Your meal is now cooking',
    OUT_FOR_DELIVERY: 'Driver picked up your order',
    NEARBY: 'Driver is nearby',
    DELIVERED: 'Order delivered. Enjoy your meal!',
  };

  constructor(
    private readonly trackingService: TrackingService,
    private readonly notificationService: NotificationService,
  ) {
    this.loadOrders();
  }

  private loadOrders(): void {
    of(mockOrders)
      .pipe(delay(400))
      .subscribe({
        next: (orders) => {
          this.ordersSubject.next(orders);
          orders.forEach((order) => this.seedExistingStatusHistory(order));
          orders.filter((o) => o.status !== 'DELIVERED').forEach((order) => this.bindTracking(order));
        },
      });
  }

  placeOrder(params: {
    userId: string;
    items: CartItem[];
    total: number;
    restaurantId: string;
    restaurantName: string;
    deliveryLocation: GeoPoint;
    restaurantLocation: GeoPoint;
  }): Observable<Order> {
    const driver = this.assignDriver();
    const newOrder: Order = {
      id: `order-${Math.floor(Math.random() * 10000)}`,
      userId: params.userId,
      restaurantId: params.restaurantId,
      restaurantName: params.restaurantName,
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      driverAvatar: driver.avatar,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      totalAmount: params.total,
      items: params.items.map((item) => ({ ...item })),
      deliveryLocation: params.deliveryLocation,
      restaurantLocation: params.restaurantLocation,
      driverLocation: driver.currentLocation,
    };
    this.ordersSubject.next([newOrder, ...this.ordersSubject.value]);
    this.bindTracking(newOrder);
    this.handleStatusNotification(newOrder, 'PLACED');
    return of(newOrder).pipe(delay(500));
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order | undefined> {
    const existing = this.ordersSubject.value.find((order) => order.id === id);
    if (!existing) {
      return of(undefined).pipe(delay(200));
    }
    if (existing.status === status) {
      return of(existing).pipe(delay(200));
    }
    const updatedOrder = { ...existing, status };
    this.ordersSubject.next(
      this.ordersSubject.value.map((order) => (order.id === id ? updatedOrder : order)),
    );
    this.handleStatusNotification(updatedOrder, status);
    if (status !== 'DELIVERED') {
      this.bindTracking(updatedOrder);
    }
    const updated = this.ordersSubject.value.find((order) => order.id === id);
    return of(updated).pipe(delay(400));
  }

  updateDriverLocation(orderId: string, point: GeoPoint): void {
    this.ordersSubject.next(
      this.ordersSubject.value.map((order) =>
        order.id === orderId ? { ...order, driverLocation: point } : order,
      ),
    );
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return this.orders$.pipe(map((orders) => orders.find((order) => order.id === id)));
  }

  getTimeline(status: OrderStatus): { label: string; completed: boolean }[] {
    const index = this.statusFlow.indexOf(status);
    return this.statusFlow.map((step, position) => ({
      label: this.statusLabel(step),
      completed: position <= index,
    }));
  }

  getStatusLabel(status: OrderStatus): string {
    return this.statusLabel(status);
  }

  private statusLabel(status: OrderStatus): string {
    switch (status) {
      case 'PLACED':
        return 'Order placed';
      case 'CONFIRMED':
        return 'Restaurant confirmed';
      case 'COOKING':
        return 'Cooking';
      case 'PACKING':
        return 'Packing';
      case 'READY_FOR_PICKUP':
        return 'Ready for pickup';
      case 'OUT_FOR_DELIVERY':
        return 'Out for delivery';
      case 'NEARBY':
        return 'Near you';
      case 'ARRIVING':
        return 'Arriving';
      case 'DELIVERED':
      default:
        return 'Delivered';
    }
  }

  private bindTracking(order: Order): void {
    this.trackingService.startMockTracking(order).subscribe({
      next: (update) => this.applyTrackingUpdate(update),
    });
  }

  private applyTrackingUpdate(update: TrackingUpdate): void {
    this.ordersSubject.next(
      this.ordersSubject.value.map((order) => {
        if (order.id !== update.orderId) {
          return order;
        }
        const nextStatus = this.advanceStatus(order.status, this.trackingStatusMap[update.distanceText]);
        if (nextStatus !== order.status) {
          this.handleStatusNotification({ ...order, status: nextStatus }, nextStatus);
        }
        return {
          ...order,
          driverLocation: update.driverLocation,
          distanceText: update.distanceText,
          etaMinutes: update.etaMinutes,
          status: nextStatus,
        };
      }),
    );
  }

  private advanceStatus(current: OrderStatus, target?: OrderStatus): OrderStatus {
    if (!target) {
      return current;
    }
    const currentIndex = this.statusFlow.indexOf(current);
    const targetIndex = this.statusFlow.indexOf(target);
    if (currentIndex === -1 || targetIndex === -1) {
      return current;
    }
    return targetIndex > currentIndex ? target : current;
  }

  private assignDriver() {
    const driver = mockDrivers[this.driverPointer % mockDrivers.length];
    this.driverPointer += 1;
    return driver;
  }

  private seedExistingStatusHistory(order: Order): void {
    const index = this.statusFlow.indexOf(order.status);
    if (index === -1) {
      return;
    }
    const statuses = this.notifiedStatuses.get(order.id) ?? new Set<OrderStatus>();
    this.statusFlow.slice(0, index + 1).forEach((status) => statuses.add(status));
    this.notifiedStatuses.set(order.id, statuses);
  }

  private handleStatusNotification(order: Order, status: OrderStatus): void {
    const message = this.statusMessages[status];
    if (!message) {
      return;
    }
    const notified = this.notifiedStatuses.get(order.id) ?? new Set<OrderStatus>();
    if (notified.has(status)) {
      return;
    }
    notified.add(status);
    this.notifiedStatuses.set(order.id, notified);
    const tone = status === 'DELIVERED' || status === 'PLACED' ? 'success' : 'info';
    const text = `${message} - ${order.restaurantName}`;
    if (tone === 'success') {
      this.notificationService.success(text, { orderId: order.id });
    } else {
      this.notificationService.info(text, { orderId: order.id });
    }
  }
}
