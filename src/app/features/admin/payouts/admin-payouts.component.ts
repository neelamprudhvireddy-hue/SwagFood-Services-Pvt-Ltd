import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-payouts',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, HttpClientModule],
  templateUrl: './admin-payouts.component.html',
  styleUrl: './admin-payouts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPayoutsComponent {
  private http = inject(HttpClient);

  private page$ = new BehaviorSubject<number>(0);
  private search$ = new BehaviorSubject<string>('');
  private sort$ = new BehaviorSubject<string>('name');

  readonly data$ = combineLatest([this.page$, this.search$, this.sort$]).pipe(
    switchMap(([page, search, sort]) => {
      let params = new HttpParams()
        .set('page', page)
        .set('size', 10)
        .set('sortBy', sort);

      if (search) {
        params = params.set('search', search);
      }

      return this.http.get<any>('http://localhost:8080/tabledata', { params });
    })
  );

  nextPage(current: number, total: number) {
    if (current < total - 1) {
      this.page$.next(current + 1);
    }
  }

  prevPage(current: number) {
    if (current > 0) {
      this.page$.next(current - 1);
    }
  }

  onSearch(value: string) {
    this.page$.next(0); // reset page
    this.search$.next(value);
  }

  onSort(value:any) {
    this.page$.next(0); // reset page
    this.sort$.next(value);
  }
}