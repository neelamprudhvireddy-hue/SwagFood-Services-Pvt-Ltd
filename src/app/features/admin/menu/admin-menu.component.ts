import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { MenuService } from '@core/services/menu.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, CurrencyPipe],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMenuComponent {
  private readonly menuService = inject(MenuService);
  readonly menuItems$ = this.menuService.menuItems$;
}
