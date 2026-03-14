import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { CartItem } from '@models/cart-item.model';
import { MenuItem } from '@models/menu-item.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly promoCodeSubject = new BehaviorSubject<string | null>(null);
  private readonly promoStatusSubject = new BehaviorSubject<{
    state: 'idle' | 'success' | 'error';
    message?: string;
  }>({ state: 'idle' });

  readonly cartItems$ = this.cartItemsSubject.asObservable();
  readonly cartSubtotal$ = this.cartItems$.pipe(
    map((items) => items.reduce((total, item) => total + item.price * item.quantity, 0)),
  );
  readonly promoCode$ = this.promoCodeSubject.asObservable();
  readonly promoStatus$ = this.promoStatusSubject.asObservable();

  readonly discount$ = combineLatest([this.cartSubtotal$, this.promoCode$]).pipe(
    map(([subtotal, code]) => this.calculateDiscount(subtotal, code)),
  );
  readonly cartTotal$ = combineLatest([this.cartSubtotal$, this.discount$]).pipe(
    map(([subtotal, discount]) => Math.max(subtotal - discount, 0)),
  );
  readonly itemCount$ = this.cartItems$.pipe(
    map((items) => items.reduce((count, item) => count + item.quantity, 0)),
  );

  constructor(private readonly notificationService: NotificationService) {
    this.loadCart();
  }

  applyPromo(code: string): boolean {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      this.promoStatusSubject.next({ state: 'error', message: 'Enter a promo code' });
      return false;
    }
    const promo = this.availablePromos[normalized];
    if (!promo) {
      this.promoStatusSubject.next({ state: 'error', message: 'Invalid promo code' });
      return false;
    }
    const subtotal = this.subtotalSnapshot();
    if (subtotal < promo.minSubtotal) {
    this.promoStatusSubject.next({
      state: 'error',
      message: `Requires minimum Rs ${promo.minSubtotal}`,
    });
      return false;
    }
    this.promoCodeSubject.next(normalized);
    this.promoStatusSubject.next({
      state: 'success',
      message: `${normalized} applied`,
    });
    this.notificationService.success(`Promo ${normalized} applied`);
    return true;
  }

  clearPromo(): void {
    this.promoCodeSubject.next(null);
    this.promoStatusSubject.next({ state: 'idle' });
  }

  private loadCart(): void {
    const cached = localStorage.getItem('swag-cart');
    if (cached) {
      try {
        this.cartItemsSubject.next(JSON.parse(cached));
        return;
      } catch {
        localStorage.removeItem('swag-cart');
      }
    }
    this.cartItemsSubject.next([]);
  }

  addMenuItem(menuItem: MenuItem): void {
    const existing = this.cartItemsSubject.value.find((item) => item.menuItemId === menuItem.id);
    if (existing) {
      this.updateQuantity(existing.id, existing.quantity + 1);
      this.notificationService.info(`${menuItem.name} quantity updated`);
      return;
    }
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `cart-${crypto.randomUUID()}`
        : `cart-${Date.now()}`;
    const newItem: CartItem = {
      id,
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image,
      isVeg: menuItem.isVeg,
    };
    this.cartItemsSubject.next([...this.cartItemsSubject.value, newItem]);
    this.persist();
    this.notificationService.success(`${menuItem.name} added to cart`);
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }
    this.cartItemsSubject.next(
      this.cartItemsSubject.value.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      ),
    );
    this.persist();
  }

  removeItem(cartItemId: string): void {
    const removedItem = this.cartItemsSubject.value.find((item) => item.id === cartItemId);
    this.cartItemsSubject.next(
      this.cartItemsSubject.value.filter((item) => item.id !== cartItemId),
    );
    this.persist();
    if (removedItem) {
      this.notificationService.info(`${removedItem.name} removed from cart`);
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.persist();
    this.clearPromo();
    this.notificationService.info('Cart cleared');
  }

  private persist(): void {
    localStorage.setItem('swag-cart', JSON.stringify(this.cartItemsSubject.value));
  }

  private subtotalSnapshot(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  private calculateDiscount(subtotal: number, code: string | null): number {
    if (!code) {
      return 0;
    }
    const promo = this.availablePromos[code];
    if (!promo || subtotal < promo.minSubtotal) {
      return 0;
    }
    if (promo.type === 'percent') {
      const percentValue = subtotal * promo.value;
      const capped = promo.maxDiscount ? Math.min(percentValue, promo.maxDiscount) : percentValue;
      return Math.round(capped);
    }
    return Math.round(promo.value);
  }

  private readonly availablePromos: Record<
    string,
    | {
        type: 'percent';
        value: number;
        minSubtotal: number;
        maxDiscount?: number;
      }
    | {
        type: 'flat';
        value: number;
        minSubtotal: number;
      }
  > = {
    SWAG50: { type: 'percent', value: 0.5, minSubtotal: 400, maxDiscount: 200 },
    FREEDEL: { type: 'flat', value: 29, minSubtotal: 199 },
    SAVER75: { type: 'flat', value: 75, minSubtotal: 800 },
  };
}

