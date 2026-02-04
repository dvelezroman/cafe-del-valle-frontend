import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-promotion-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion-management.html',
  styleUrl: './promotion-management.scss'
})
export class PromotionManagement implements OnInit {
  promotions: any[] = [];
  referralPoints = 50;
  loading = true;
  showNewModal = false;

  private adminApi = 'http://localhost:3000/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);

    // Fetch system config
    this.http.get<any>(`${this.adminApi}/config`, { headers }).subscribe({
      next: (config) => {
        this.referralPoints = parseInt(config.POINTS_PER_REFERRAL, 10);
      }
    });

    // Fetch promotions
    this.http.get<any[]>(`${this.adminApi}/promotions`, { headers }).subscribe({
      next: (res) => {
        this.promotions = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  saveReferralPoints() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    this.http.patch(`${this.adminApi}/config/referral-points`, { points: this.referralPoints }, { headers }).subscribe({
      next: () => {
        alert('Configuración actualizada con éxito.');
      },
      error: () => alert('Error al actualizar la configuración.')
    });
  }
}
