import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, NgForOf, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  @Input() transparent = false;

  readonly cartCount$;
  readonly user$;

  // ✅ Correct reactive state
  private locationSubject = new BehaviorSubject<string>('Fetching location...');
  location$: Observable<string> = this.locationSubject.asObservable();

  constructor(
    private http: HttpClient,
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {
    this.cartCount$ = this.cartService.itemCount$;
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.getLocation();
  }

  // ✅ Get user location
  getLocation() {
    if (!navigator.geolocation) {
      this.locationSubject.next('Location not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // ⚠️ Replace with your real key OR move to backend
        const apiKey = '1b10367c2b844db1ba75f06d2836bd9b';

        this.http
          .get<any>(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`)
          .subscribe({
            next: (res) => {
              const comp = res?.results?.[0]?.components;

              const place =
                comp?.city ||
                comp?.town ||
                comp?.village ||
                comp?.state ||
                'Unknown location';

              this.locationSubject.next(place);
            },
            error: () => {
              this.locationSubject.next('Unable to fetch location');
            }
          });
      },
      () => {
        this.locationSubject.next('Permission denied');
      }
    );
  }

  // 🔄 Refresh location
  refreshLocation() {
    this.locationSubject.next('Refreshing...');
    this.getLocation();
  }

  // 🔗 Menu logic
  private readonly menus: Record<UserRole | 'GUEST', { label: string; path: string }[]> = {
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

  navLinks(role: UserRole | null): { label: string; path: string }[] {
    return role ? this.menus[role] : this.menus['GUEST'];
  }

  logout(): void {
    this.authService.logout();
  }
}