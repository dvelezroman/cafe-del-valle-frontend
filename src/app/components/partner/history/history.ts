import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

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
    this.http.get<any>(`${environment.apiUrl}/partner/profile`).subscribe({
      next: (res) => {
        this.records = res.consumptionRecords;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
