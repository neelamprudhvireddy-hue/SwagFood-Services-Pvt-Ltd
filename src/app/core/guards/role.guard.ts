import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles: UserRole[] = route.data?.['roles'] ?? [];
  const user = authService.snapshot;

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (!allowedRoles.length || allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree([authService.getRedirectPath(user.role)]);
};
