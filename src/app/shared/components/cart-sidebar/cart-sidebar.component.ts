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
  userSubject: any;
  isRoleBase: any;

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

    
ngOnInit() {
  const storedUser = localStorage.getItem("swag-user");

  if (storedUser) {
    this.isRoleBase = JSON.parse(storedUser);

    console.log("User role from localStorage:", this.isRoleBase);

    if (this.isRoleBase.role === "ADMIN") {
      this.isRoleBase=false;
    }
  }
}

}
