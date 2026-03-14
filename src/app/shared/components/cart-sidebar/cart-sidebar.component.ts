import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss',
})
export class CartSidebarComponent {
  readonly cartItems$;
  readonly total$;

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.total$ = this.cartService.cartTotal$;
  }

  increment(id: string, current: number): void {
    this.cartService.updateQuantity(id, current + 1);
  }

  decrement(id: string, current: number): void {
    this.cartService.updateQuantity(id, current - 1);
  }

  remove(id: string): void {
    this.cartService.removeItem(id);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
