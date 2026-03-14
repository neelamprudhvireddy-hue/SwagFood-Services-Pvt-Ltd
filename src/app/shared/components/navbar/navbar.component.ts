import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, NgForOf, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input({ required: false }) transparent = false;

  readonly cartCount$;
  readonly user$;

  private readonly menus: Record<
    UserRole | 'GUEST',
    { label: string; path: string }[]
  > = {
    ADMIN: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Restaurants', path: '/restaurants' },
      { label: 'Menu', path: '/menu/rest-spice-route' },
      { label: 'Orders', path: '/orders' },
      { label: 'Analytics', path: '/admin/dashboard' },
    ],
    MANAGER: [
      { label: 'Dashboard', path: '/manager/dashboard' },
      { label: 'Inventory', path: '/manager/dashboard' },
      { label: 'Orders', path: '/orders' },
      { label: 'Performance', path: '/manager/dashboard' },
    ],
    WORKER: [
      { label: 'Orders', path: '/orders' },
      { label: 'Update Status', path: '/worker/dashboard' },
      { label: 'Support', path: '/support' },
    ],
    CUSTOMER: [
      { label: 'Home', path: '/home' },
      { label: 'Restaurants', path: '/restaurants' },
      { label: 'Cart', path: '/cart' },
      { label: 'Orders', path: '/orders' },
      { label: 'Support', path: '/support' },
      { label: 'Profile', path: '/profile' },
    ],
    GUEST: [
      { label: 'Home', path: '/home' },
      { label: 'Restaurants', path: '/restaurants' },
      { label: 'Support', path: '/support' },
      { label: 'Login', path: '/login' },
    ],
  };

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) {
    this.cartCount$ = this.cartService.itemCount$;
    this.user$ = this.authService.user$;
  }

  navLinks(role: UserRole | null): { label: string; path: string }[] {
    if (!role) {
      return this.menus['GUEST'];
    }
    return this.menus[role];
  }

  logout(): void {
    this.authService.logout();
  }
}
