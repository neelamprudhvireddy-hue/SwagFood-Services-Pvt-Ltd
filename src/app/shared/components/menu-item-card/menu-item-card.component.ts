import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '@models/menu-item.model';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-card.component.html',
  styleUrl: './menu-item-card.component.scss',
})
export class MenuItemCardComponent {
  @Input({ required: true }) menuItem!: MenuItem;

  constructor(private readonly cartService: CartService) {}

  addToCart(): void {
    this.cartService.addMenuItem(this.menuItem);
  }
}

