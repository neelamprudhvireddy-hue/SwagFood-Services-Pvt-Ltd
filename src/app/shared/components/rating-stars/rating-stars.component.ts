import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.scss',
})
export class RatingStarsComponent {
  @Input({ required: true }) rating!: number;
}
