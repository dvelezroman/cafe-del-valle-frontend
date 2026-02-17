import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-partner-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  profile: any = null;
  referralPoints = 50;
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchProfile();
    this.fetchConfig();
  }

  fetchProfile() {
    this.http.get<any>(`${environment.apiUrl}/partner/profile`).subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  fetchConfig() {
    // Public config endpoint would be better, but for now we can infer or call admin if we had permission
    // Assuming 50 for now or fetching from a public route if implemented.
    // In a real app, I'd implement GET /partners/config
  }

  copyCode() {
    if (this.profile?.referralCode) {
      navigator.clipboard.writeText(this.profile.referralCode);
      this.toastService.success('Código copiado al portapapeles!');
    }
  }
}
