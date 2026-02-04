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
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    this.http.get<any>('http://localhost:3000/api/partner/profile', { headers }).subscribe({
      next: (res) => {
        this.records = res.consumptionRecords;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
