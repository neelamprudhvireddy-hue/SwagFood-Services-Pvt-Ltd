import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    title: 'Admin Dashboard',
  },
  {
    path: 'restaurants',
    loadComponent: () =>
      import('./restaurants/admin-restaurants.component').then((m) => m.AdminRestaurantsComponent),
    title: 'Restaurant Management',
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./menu/admin-menu.component').then((m) => m.AdminMenuComponent),
    title: 'Menu Management',
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
    title: 'Order Management',
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/admin-analytics.component').then((m) => m.AdminAnalyticsComponent),
    title: 'Analytics',
  },
  {
    path: 'payouts',
    loadComponent: () =>
      import('./payouts/admin-payouts.component').then((m) => m.AdminPayoutsComponent),
    title: 'Payout Center',
  },
  {
    path: 'campaigns',
    loadComponent: () =>
      import('./campaigns/admin-campaigns.component').then((m) => m.AdminCampaignsComponent),
    title: 'Marketing Campaigns',
  },
];
