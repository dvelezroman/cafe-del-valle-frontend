import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

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
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchPending();
  }

  fetchPending() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.pendingPartners = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  validate(id: string, status: 'APPROVED' | 'REJECTED') {
    if (!confirm(`¿Estás seguro de que deseas ${status === 'APPROVED' ? 'aprobar' : 'rechazar'} a este socio?`)) return;

    this.http.patch(`http://localhost:3000/api/admin/partners/${id}/validate`, { status, referralPoints: 50 }).subscribe({
      next: () => {
        this.pendingPartners = this.pendingPartners.filter(p => p.id !== id);
        this.toastService.success(`Socio ${status === 'APPROVED' ? 'aprobado' : 'rechazado'} con éxito.`);
      },
      error: (err) => this.toastService.error('Error al procesar la solicitud.')
    });
  }
}
