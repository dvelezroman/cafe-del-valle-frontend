import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

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
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {

    // Fetch system config
    this.http.get<any>(`${this.adminApi}/config`).subscribe({
      next: (config) => {
        this.referralPoints = parseInt(config.POINTS_PER_REFERRAL, 10);
      }
    });

    // Fetch promotions
    this.http.get<any[]>(`${this.adminApi}/promotions`).subscribe({
      next: (res) => {
        this.promotions = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  saveReferralPoints() {
    this.http.patch(`${this.adminApi}/config/referral-points`, { points: this.referralPoints }).subscribe({
      next: () => {
        this.toastService.success('Configuración actualizada con éxito.');
      },
      error: () => this.toastService.error('Error al actualizar la configuración.')
    });
  }
}
