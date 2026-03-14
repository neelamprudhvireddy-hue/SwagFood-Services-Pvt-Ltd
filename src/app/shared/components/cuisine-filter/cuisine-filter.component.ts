import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgClass } from '@angular/common';

@Component({
  selector: 'app-cuisine-filter',
  standalone: true,
  imports: [NgForOf, NgClass],
  templateUrl: './cuisine-filter.component.html',
  styleUrl: './cuisine-filter.component.scss',
})
export class CuisineFilterComponent {
  @Input() cuisines: string[] = [];
  @Input() selected: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();

  toggleCuisine(cuisine: string): void {
    const exists = this.selected.includes(cuisine);
    const updated = exists
      ? this.selected.filter((item) => item !== cuisine)
      : [...this.selected, cuisine];
    this.selected = updated;
    this.selectionChange.emit(updated);
  }
}

