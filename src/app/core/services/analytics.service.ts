import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  AnalyticsStat,
  Campaign,
  ChartPoint,
  StaffMember,
} from '@models/analytics.model';
import {
  adminMetrics,
  adminQuickLinks,
  campaigns,
  consumerKeyStats,
  managerInsights,
  ordersPerDay,
  revenuePerMonth,
  staffRoster,
} from '@core/data/mock-analytics';
import { RestaurantService } from './restaurant.service';
import { MenuService } from './menu.service';
import { OrderService } from './order.service';
import { OrderStatus } from '@models/order.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
  ) {}

  getConsumerKeyStats(): Observable<AnalyticsStat[]> {
    return of(consumerKeyStats).pipe(delay(300));
  }

  getAdminMetrics(): Observable<AnalyticsStat[]> {
    return of(adminMetrics).pipe(delay(300));
  }

  getManagerInsights(): Observable<AnalyticsStat[]> {
    return of(managerInsights).pipe(delay(300));
  }

  getAdminQuickLinks(): Observable<
    { label: string; hint: string; path: string }[]
  > {
    return of(adminQuickLinks).pipe(delay(200));
  }

  getCampaigns(): Observable<Campaign[]> {
    return of(campaigns).pipe(delay(400));
  }

  getStaffRoster(): Observable<StaffMember[]> {
    return of(staffRoster).pipe(delay(400));
  }

  getOrdersPerDay(): Observable<ChartPoint[]> {
    return of(ordersPerDay).pipe(delay(400));
  }

  getRevenuePerMonth(): Observable<ChartPoint[]> {
    return of(revenuePerMonth).pipe(delay(400));
  }

  getTopRestaurants(limit = 5): Observable<ChartPoint[]> {
    return this.restaurantService.restaurants$.pipe(
      map((restaurants) =>
        restaurants
          .slice()
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit)
          .map((restaurant) => ({
            label: restaurant.name,
            value: Math.floor(500 + restaurant.rating * 120),
            subtitle: `${restaurant.rating.toFixed(1)} *`,
          })),
      ),
    );
  }

  getTopItems(limit = 5): Observable<ChartPoint[]> {
    return this.menuService.menuItems$.pipe(
      map((items) =>
        items
          .slice()
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit)
          .map((item) => ({
            label: item.name,
            value: Math.floor(200 + item.rating * 80),
            subtitle: `${item.category} | ${item.rating.toFixed(1)} *`,
          })),
      ),
    );
  }

  getDeliveryPerformance(): Observable<ChartPoint[]> {
    return this.orderService.orders$.pipe(
      map((orders) => {
        const totals = new Map<OrderStatus, number>();
        orders.forEach((order) => {
          totals.set(order.status, (totals.get(order.status) ?? 0) + 1);
        });
        return Array.from(totals.entries()).map(([status, value]) => ({
          label: this.orderService.getStatusLabel(status),
          value,
        }));
      }),
    );
  }
}
