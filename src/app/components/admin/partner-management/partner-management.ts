import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-partner-management',
  imports: [CommonModule],
  templateUrl: './partner-management.html',
  styleUrl: './partner-management.scss'
})
export class PartnerManagement implements OnInit {
  pendingPartners: any[] = [];
  loading = true;
  private apiUrl = 'http://localhost:3000/api/admin/partners/pending';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchPending();
  }

  fetchPending() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        this.pendingPartners = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  validate(id: string, status: 'APPROVED' | 'REJECTED') {
    if (!confirm(`¿Estás seguro de que deseas ${status === 'APPROVED' ? 'aprobar' : 'rechazar'} a este socio?`)) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    this.http.patch(`http://localhost:3000/api/admin/partners/${id}/validate`, { status }, { headers }).subscribe({
      next: () => {
        this.pendingPartners = this.pendingPartners.filter(p => p.id !== id);
        alert(`Socio ${status === 'APPROVED' ? 'aprobado' : 'rechazado'} con éxito.`);
      },
      error: (err) => alert('Error al procesar la solicitud.')
    });
  }
}
