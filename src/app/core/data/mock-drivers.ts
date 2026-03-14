import { Driver } from '@models/driver.model';

export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Farhan Shaik',
    phone: '+91 90000 55511',
    vehicle: 'TS09 AW 5521',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    currentLocation: { lat: 17.3885, lng: 78.479 },
    status: 'ON_DELIVERY',
  },
  {
    id: 'driver-2',
    name: 'Nisha Patel',
    phone: '+91 90000 55522',
    vehicle: 'TS09 FC 9911',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    currentLocation: { lat: 17.3862, lng: 78.4825 },
    status: 'AVAILABLE',
  },
  {
    id: 'driver-3',
    name: 'Aditya Kulkarni',
    phone: '+91 90000 55533',
    vehicle: 'TS09 AB 3300',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    currentLocation: { lat: 17.3899, lng: 78.4698 },
    status: 'AVAILABLE',
  },
];
