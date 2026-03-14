import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    loadChildren: () =>
      import('@features/customer/customer.routes').then((m) => m.CUSTOMER_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANAGER'] },
    loadChildren: () => import('@features/manager/manager.routes').then((m) => m.MANAGER_ROUTES),
  },
  {
    path: 'worker',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['WORKER'] },
    loadChildren: () => import('@features/worker/worker.routes').then((m) => m.WORKER_ROUTES),
  },
  { path: '**', redirectTo: 'home' },
];
