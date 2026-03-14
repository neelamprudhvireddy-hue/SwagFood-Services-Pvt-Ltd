import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartPoint } from '@models/analytics.model';

type ChartVariant = 'line' | 'bar' | 'list';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-chart.component.html',
  styleUrl: './analytics-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent {
  @Input({ required: true }) title = '';
  @Input() description = '';
  @Input() variant: ChartVariant = 'bar';
  @Input() data: ChartPoint[] | null = [];
  @Input() valuePrefix = '';
  @Input() valueSuffix = '';

  private readonly lineWidth = 100;
  private readonly lineHeight = 60;

  get safeData(): ChartPoint[] {
    return this.data ?? [];
  }

  get maxValue(): number {
    const max = Math.max(...this.safeData.map((point) => point.value), 0);
    return max || 1;
  }

  barWidth(point: ChartPoint): string {
    return `${(point.value / this.maxValue) * 100}%`;
  }

  formatValue(value: number): string {
    return `${this.valuePrefix}${value.toLocaleString()}${this.valueSuffix}`;
  }

  linePoints(): string {
    const points = this.safeData;
    if (!points.length) {
      return '';
    }
    const max = this.maxValue;
    const denominator = Math.max(points.length - 1, 1);
    return points
      .map((point, index) => {
        const x = (index / denominator) * this.lineWidth;
        const y = this.lineHeight - (point.value / max) * this.lineHeight;
        return `${x},${y}`;
      })
      .join(' ');
  }
}
