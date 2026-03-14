import { CartItem } from './cart-item.model';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'COOKING'
  | 'PACKING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'NEARBY'
  | 'ARRIVING'
  | 'DELIVERED';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: CartItem[];
  deliveryLocation: GeoPoint;
  restaurantLocation: GeoPoint;
  driverLocation: GeoPoint;
  distanceText?: string;
  etaMinutes?: number;
}
