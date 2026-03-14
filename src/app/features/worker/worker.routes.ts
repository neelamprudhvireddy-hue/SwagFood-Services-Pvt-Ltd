import { Routes } from '@angular/router';

export const WORKER_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/worker-dashboard.component').then((m) => m.WorkerDashboardComponent),
    title: 'Worker Dashboard',
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/worker-orders.component').then((m) => m.WorkerOrdersComponent),
    title: 'Order Queue',
  },
];
