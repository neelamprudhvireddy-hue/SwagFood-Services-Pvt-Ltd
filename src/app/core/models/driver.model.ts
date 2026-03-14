import { GeoPoint } from './order.model';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  avatar: string;
  currentLocation: GeoPoint;
  status: 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE';
}
