import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-payouts',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './admin-payouts.component.html',
  styleUrls: ['./admin-payouts.component.scss']
})
export class AdminPayoutsComponent {

  private http = inject(HttpClient);

  payoutList: any[] = [];
  loading = false;

  page = 1;
  size = 10;
  sort = 'restaurant';
  orderBy = 'desc';
  search = '';

  totalPages = 1;
  hasNext = false;
  hasPrevious = false;

  searchTimeout: any;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    const payload = { search: this.search || '' };

    const url = `http://192.168.1.12:8080/SwagBackendService/Users/PayoutTableData`;
    const params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString())
      .set('sortBy', this.sort)
      .set('orderBy', this.orderBy)
      .set('_', Date.now().toString()); // prevent cache

    this.http.post<any>(url, payload, { params }).subscribe({
      next: (res) => {
        // Response: content array + pagination metadata
        this.payoutList = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.hasNext = res.hasNext || false;
        this.hasPrevious = res.hasPrevious || false;
        this.page = res.currentPage || 1;
        this.loading = false;
      },
      error: () => {
        this.payoutList = [];
        this.loading = false;
      }
    });
  }

  // Debounced search
  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 1;
      this.search = value;
      this.loadData();
    }, 300);
  }

  // Sorting
  onSort(value: string) {
    this.page = 1;
    this.sort = value;
    this.loadData();
  }

  // Pagination
  nextPage() {
    if (this.hasNext) {
      this.page++;
      this.loadData();
    }
  }

  prevPage() {
    if (this.hasPrevious) {
      this.page--;
      this.loadData();
    }
  }
}