import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    title: 'SwagFood - Home',
  },
  {
    path: 'restaurants',
    loadComponent: () =>
      import('./restaurants/restaurants.component').then((m) => m.RestaurantsComponent),
    title: 'Restaurants near you',
  },
  {
    path: 'restaurants/:id',
    loadComponent: () =>
      import('./restaurant-detail/restaurant-detail.component').then(
        (m) => m.RestaurantDetailComponent,
      ),
    title: 'Restaurant details',
  },
  {
    path: 'menu/:restaurantId',
    loadComponent: () => import('./menu/menu.component').then((m) => m.MenuComponent),
    title: 'Menu',
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Checkout',
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./orders/orders.component').then((m) => m.OrdersComponent),
    title: 'Your orders',
  },
  {
    path: 'order-tracking/:orderId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./order-tracking/order-tracking.component').then((m) => m.OrderTrackingComponent),
    title: 'Track order',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
    title: 'Profile',
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'Favorites',
  },
  {
    path: 'support',
    loadComponent: () => import('./support/support.component').then((m) => m.SupportComponent),
    title: 'Support',
  },
];
