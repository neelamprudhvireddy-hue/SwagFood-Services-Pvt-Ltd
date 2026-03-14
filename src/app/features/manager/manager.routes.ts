import { Routes } from '@angular/router';

export const MANAGER_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/manager-dashboard.component').then((m) => m.ManagerDashboardComponent),
    title: 'Manager Dashboard',
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./inventory/manager-inventory.component').then((m) => m.ManagerInventoryComponent),
    title: 'Inventory',
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./staff/manager-staff.component').then((m) => m.ManagerStaffComponent),
    title: 'Staff Management',
  },
];
