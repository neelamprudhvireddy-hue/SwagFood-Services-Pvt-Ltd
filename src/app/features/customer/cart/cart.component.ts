import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly items$;
  readonly subtotal$;
  readonly total$;
  readonly discount$;
  readonly promoCode$;
  readonly promoStatus$;
  readonly promoForm;
  readonly deliveryFee = 29;

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
  ) {
    this.items$ = this.cartService.cartItems$;
    this.subtotal$ = this.cartService.cartSubtotal$;
    this.total$ = this.cartService.cartTotal$;
    this.discount$ = this.cartService.discount$;
    this.promoCode$ = this.cartService.promoCode$;
    this.promoStatus$ = this.cartService.promoStatus$;
    this.promoForm = this.fb.group({
      code: [''],
    });
  }

  increment(id: string, quantity: number): void {
    this.cartService.updateQuantity(id, quantity + 1);
  }

  decrement(id: string, quantity: number): void {
    this.cartService.updateQuantity(id, quantity - 1);
  }

  remove(id: string): void {
    this.cartService.removeItem(id);
  }

  applyPromo(): void {
    const code = (this.promoForm.value.code ?? '').trim();
    if (this.cartService.applyPromo(code)) {
      this.promoForm.reset();
    }
  }

  clearPromo(): void {
    this.cartService.clearPromo();
    this.promoForm.reset();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
