import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  @Input() lines = 1;
  @Input() height = 16;
  @Input() radius = 12;
  @Input() shimmer = true;

  get placeholders(): number[] {
    return Array.from({ length: this.lines }, (_, index) => index);
  }
}
