import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { RestaurantService } from '@core/services/restaurant.service';
import { AuthService } from '@core/services/auth.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { Order } from '@models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgForOf, NgIf, ModalComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  readonly cartItems$;
  readonly cartTotal$;
  readonly cartSubtotal$;
  readonly discount$;
  readonly promoCode$;
  readonly deliveryFee = 29;

  confirmation?: Order;

  form!: FormGroup;
  loading = false;

  paymentMethods = [
    { label: 'UPI', value: 'upi' },
    { label: 'Credit Card', value: 'card' },
    { label: 'Cash on delivery', value: 'cod' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly restaurantService: RestaurantService,
    private readonly authService: AuthService,
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.cartTotal$;
    this.cartSubtotal$ = this.cartService.cartSubtotal$;
    this.discount$ = this.cartService.discount$;
    this.promoCode$ = this.cartService.promoCode$;
    this.form = this.fb.group({
      customerName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]],
      instructions: [''],
      paymentMethod: ['upi', Validators.required],
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const [items, total] = await Promise.all([
      firstValueFrom(this.cartItems$),
      firstValueFrom(this.cartTotal$),
    ]);

    if (!items.length) {
      this.loading = false;
      return;
    }

    const restaurantId = items[0].restaurantId;
    const restaurant = await firstValueFrom(this.restaurantService.getRestaurant(restaurantId));

    this.orderService
      .placeOrder({
        userId: this.authService.snapshot?.id ?? 'guest',
        items,
        total: total + this.deliveryFee,
        restaurantId,
        restaurantName: restaurant?.name ?? 'Partner restaurant',
        deliveryLocation: { lat: 17.392, lng: 78.4744 },
        restaurantLocation: { lat: 17.385, lng: 78.4867 },
      })
      .subscribe({
        next: (order) => {
          this.confirmation = order;
          this.cartService.clearCart();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  fieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  errorText(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return 'This field is required';
    }
    if (control.errors['pattern']) {
      return field === 'phone' ? 'Enter 10 digit phone' : 'Invalid value';
    }
    if (control.errors['minlength']) {
      return `Use at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid value';
  }

  closeModal(): void {
    this.confirmation = undefined;
  }
}
