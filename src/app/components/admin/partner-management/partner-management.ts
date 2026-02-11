import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { SubscriptionService, SubscriptionPlan } from '../../../services/subscription.service';
import { SubscriberManagementService } from '../../../services/subscriber-management.service';

@Component({
  selector: 'app-partner-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './partner-management.html',
  styleUrl: './partner-management.scss'
})
export class PartnerManagement implements OnInit {
  pendingPartners: any[] = [];
  approvedPartners: any[] = [];
  loading = true;
  showApprovalModal = false;
  showSubscriptionModal = false;
  selectedPartner: any = null;
  selectedPlan: SubscriptionPlan | null = null;
  availablePlans: SubscriptionPlan[] = [];
  availableCodes: any[] = [];
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private subscriptionService: SubscriptionService,
    public subscriberService: SubscriberManagementService
  ) { }

  ngOnInit() {
    this.fetchPending();
    this.fetchApproved();
    this.subscriptionService.getAdminPlans().subscribe({
      next: (plans) => {
        this.availablePlans = plans.filter(p => p.active);
      }
    });
  }

  fetchPending() {
    this.http.get<any[]>(`${this.apiUrl}/admin/partners/pending`).subscribe({
      next: (res) => {
        this.pendingPartners = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  fetchApproved() {
    // Fetch approved partners with their subscriptions
    this.http.get<any[]>(`${this.apiUrl}/admin/partners`).subscribe({
      next: (res) => {
        this.approvedPartners = res.filter((p: any) => p.status === 'APPROVED');
      }
    });
  }

  openApprovalModal(partner: any) {
    this.selectedPartner = partner;
    this.showApprovalModal = true;
  }

  closeApprovalModal() {
    this.showApprovalModal = false;
    this.selectedPartner = null;
    this.selectedPlan = null;
  }

  validate(id: string, status: 'APPROVED' | 'REJECTED', planId?: string) {
    if (status === 'APPROVED' && !planId) {
      this.toastService.error('Debes seleccionar un plan de suscripción');
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas ${status === 'APPROVED' ? 'aprobar' : 'rechazar'} a este socio?`)) return;

    const payload: any = { status, referralPoints: 50 };
    if (planId) {
      payload.planId = planId;
    }

    this.http.patch(`${this.apiUrl}/admin/partners/${id}/validate`, payload).subscribe({
      next: () => {
        this.pendingPartners = this.pendingPartners.filter(p => p.id !== id);
        this.toastService.success(`Socio ${status === 'APPROVED' ? 'aprobado' : 'rechazar'} con éxito.`);
        this.closeApprovalModal();
        this.fetchApproved();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al procesar la solicitud.');
      }
    });
  }

  openSubscriptionModal(partner: any) {
    this.selectedPartner = partner;
    this.showSubscriptionModal = true;
    // Load available codes
    this.subscriberService.getAllCodes('GENERATED').subscribe({
      next: (codes) => {
        this.availableCodes = codes.filter(c => c.status === 'GENERATED');
      }
    });
  }

  closeSubscriptionModal() {
    this.showSubscriptionModal = false;
    this.selectedPartner = null;
    this.selectedPlan = null;
  }

  assignAdditionalSubscription(partnerId: string, codeId: string, planId: string) {
    if (!codeId || !planId) {
      this.toastService.error('Debes seleccionar un código y un plan');
      return;
    }

    this.http.post(`${this.apiUrl}/admin/partners/${partnerId}/subscriptions`, {
      codeId,
      planId
    }).subscribe({
      next: () => {
        this.toastService.success('Suscripción asignada con éxito');
        this.closeSubscriptionModal();
        this.fetchApproved();
        this.subscriberService.getAllSubscribers().subscribe();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al asignar suscripción');
      }
    });
  }

  getPartnerSubscriptions(partnerId: string) {
    return this.subscriberService.subscribers().filter(s => s.partnerProfileId === partnerId);
  }
}
