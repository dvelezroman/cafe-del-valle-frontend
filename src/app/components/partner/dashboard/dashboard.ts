import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchProfile();
    this.fetchConfig();
  }

  fetchProfile() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    this.http.get<any>('http://localhost:3000/api/partner/profile', { headers }).subscribe({
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
      alert('Código copiado al portapapeles!');
    }
  }
}
