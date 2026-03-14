import { Order } from '@models/order.model';
import { mockDrivers } from '@core/data/mock-drivers';

export const mockOrders: Order[] = [
  {
    id: 'order-2481',
    userId: 'user-1',
    restaurantId: 'rest-spice-route',
    restaurantName: 'Spice Route Kitchen',
    driverId: mockDrivers[0].id,
    driverName: mockDrivers[0].name,
    driverPhone: mockDrivers[0].phone,
    driverAvatar: mockDrivers[0].avatar,
    status: 'DELIVERED',
    createdAt: '2026-03-12T18:25:00.000Z',
    totalAmount: 589,
    items: [
      {
        id: 'cart-1',
        menuItemId: 'menu-hyderabadi-biryani',
        restaurantId: 'rest-spice-route',
        name: 'Dum Handi Biryani',
        price: 289,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1606149059549-6042addafc1f?auto=format&fit=crop&w=900&q=80',
        isVeg: false,
      },
      {
        id: 'cart-3',
        menuItemId: 'menu-paneer-tikka-wrap',
        restaurantId: 'rest-spice-route',
        name: 'Tandoori Paneer Roomali Wrap',
        price: 219,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
        isVeg: true,
      },
    ],
    deliveryLocation: { lat: 17.392, lng: 78.4744 },
    restaurantLocation: { lat: 17.385, lng: 78.4867 },
    driverLocation: { lat: 17.392, lng: 78.4744 },
    distanceText: 'Delivered',
    etaMinutes: 0,
  },
  {
    id: 'order-2482',
    userId: 'user-1',
    restaurantId: 'rest-noodle-lab',
    restaurantName: 'Noodle Lab',
    driverId: mockDrivers[1].id,
    driverName: mockDrivers[1].name,
    driverPhone: mockDrivers[1].phone,
    driverAvatar: mockDrivers[1].avatar,
    status: 'OUT_FOR_DELIVERY',
    createdAt: '2026-03-13T14:10:00.000Z',
    totalAmount: 628,
    items: [
      {
        id: 'cart-4',
        menuItemId: 'menu-dan-dan-noodles',
        restaurantId: 'rest-noodle-lab',
        name: 'Dan Dan Burnt-Chili Noodles',
        price: 329,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80',
        isVeg: false,
      },
      {
        id: 'cart-5',
        menuItemId: 'menu-crystal-dimsum',
        restaurantId: 'rest-noodle-lab',
        name: 'Truffle Crystal Dimsum',
        price: 299,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
        isVeg: true,
      },
    ],
    deliveryLocation: { lat: 17.392, lng: 78.4744 },
    restaurantLocation: { lat: 17.385, lng: 78.4867 },
    driverLocation: { lat: 17.3885, lng: 78.479 },
    distanceText: '2 km away',
    etaMinutes: 9,
  },
];
