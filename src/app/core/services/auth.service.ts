import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '@models/user.model';
import { mockUsers } from '@core/data/mock-users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'swag-user';
  private readonly credentialMap: Record<string, string> = {
    'admin@swagfood.com': 'admin123',
    'manager@swagfood.com': 'manager123',
    'worker@swagfood.com': 'worker123',
    'user@swagfood.com': 'user123',
  };
  private readonly usersByEmail = new Map<string, User>(
    mockUsers.map((user) => [user.email, { ...user }]),
  );

  private readonly userSubject = new BehaviorSubject<User | null>(null);

  readonly user$ = this.userSubject.asObservable();

  constructor() {
    this.hydrateFromStorage();
  }

  get snapshot(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const storedPassword = this.credentialMap[email];
    const profile = this.usersByEmail.get(email);
    if (!profile || storedPassword !== password) {
      return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
    }
    return of(profile).pipe(
      delay(500),
      tap((user) => {
        this.persistUser(user);
      }),
    );
  }

  logout(): void {
    this.userSubject.next(null);
    this.storage?.removeItem(this.storageKey);
  }

  updateProfile(profile: Partial<User>): void {
    if (!this.snapshot) {
      return;
    }
    const updated = { ...this.snapshot, ...profile };
    this.persistUser(updated);
  }

  toggleFavorite(restaurantId: string): void {
    if (!this.snapshot) {
      return;
    }
    const favorites = new Set(this.snapshot.favorites);
    if (favorites.has(restaurantId)) {
      favorites.delete(restaurantId);
    } else {
      favorites.add(restaurantId);
    }
    this.updateProfile({ favorites: Array.from(favorites) });
  }

  isFavorite(restaurantId: string): boolean {
    return this.snapshot?.favorites.includes(restaurantId) ?? false;
  }

  adjustWallet(amount: number): void {
    if (!this.snapshot) {
      return;
    }
    this.updateProfile({ walletBalance: this.snapshot.walletBalance + amount });
  }

  addLoyaltyPoints(points: number): void {
    if (!this.snapshot) {
      return;
    }
    this.updateProfile({ loyaltyPoints: this.snapshot.loyaltyPoints + points });
  }

  getRedirectPath(role: UserRole | null): string {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'WORKER':
        return '/worker/dashboard';
      case 'CUSTOMER':
      default:
        return '/home';
    }
  }

  private persistUser(user: User): void {
    this.usersByEmail.set(user.email, { ...user });
    this.userSubject.next(user);
    this.storage?.setItem(this.storageKey, JSON.stringify(user));
  }

  private hydrateFromStorage(): void {
    const raw = this.storage?.getItem(this.storageKey);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as User;
      this.usersByEmail.set(parsed.email, { ...parsed });
      this.userSubject.next(parsed);
    } catch {
      this.storage?.removeItem(this.storageKey);
    }
  }

  private get storage(): Storage | null {
    try {
      return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
      return null;
    }
  }
}
