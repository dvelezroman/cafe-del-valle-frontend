import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  records: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    this.http.get<any>('http://localhost:3000/api/partner/profile').subscribe({
      next: (res) => {
        this.records = res.consumptionRecords;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
