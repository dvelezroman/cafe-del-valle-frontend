import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { SubscriptionService, SubscriptionPlan } from '../../../services/subscription.service';
import { SubscriberManagementService } from '../../../services/subscriber-management.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-partner-management',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './partner-management.html',
  styleUrl: './partner-management.scss'
})
export class PartnerManagement implements OnInit {
  pendingPartners: any[] = [];
  approvedPartners: any[] = [];
  loading = true;
  showApprovalModal = false;
  showSubscriptionModal = false;
  showEditModal = false;
  showPointsModal = false;
  showDetailsModal = false;
  showDeleteModal = false;
  isSaving = false;
  isSavingPoints = false;
  isDeleting = false;
  isAssigningSubscription = false;
  selectedPartner: any = null;
  selectedPlan: SubscriptionPlan | null = null;
  availablePlans: SubscriptionPlan[] = [];
  availableCodes: any[] = [];
  consumptionHistory: any[] = [];
  
  editFormData: any = {
    name: '',
    email: '',
    phone: ''
  };
  
  pointsFormData: any = {
    points: 0,
    reason: ''
  };
  
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private subscriptionService: SubscriptionService,
    public subscriberService: SubscriberManagementService,
    private confirmationService: ConfirmationService
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

    this.confirmationService.show({
      title: status === 'APPROVED' ? 'Confirmar Aprobación' : 'Confirmar Rechazo',
      message: `¿Estás seguro de que deseas <strong>${status === 'APPROVED' ? 'aprobar' : 'rechazar'}</strong> a este socio?`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      confirmButtonClass: status === 'APPROVED' ? 'primary' : 'danger'
    }).pipe(take(1)).subscribe((result: any) => {
      if (!result.confirmed) return;
      this.executeValidation(id, status, planId);
    });
  }

  private executeValidation(id: string, status: 'APPROVED' | 'REJECTED', planId?: string) {

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

    if (this.isAssigningSubscription) return;

    this.isAssigningSubscription = true;
    this.http.post(`${this.apiUrl}/admin/partners/${partnerId}/subscriptions`, {
      codeId,
      planId
    }).subscribe({
      next: () => {
        this.isAssigningSubscription = false;
        this.toastService.success('Suscripción asignada con éxito');
        this.closeSubscriptionModal();
        this.fetchApproved();
        this.subscriberService.getAllSubscribers().subscribe();
      },
      error: (err) => {
        this.isAssigningSubscription = false;
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al asignar suscripción');
      }
    });
  }

  getPartnerSubscriptions(partnerId: string) {
    return this.subscriberService.subscribers().filter(s => s.partnerProfileId === partnerId);
  }

  // Edit Partner
  openEditModal(partner: any) {
    this.selectedPartner = partner;
    this.editFormData = {
      name: partner.user.name,
      email: partner.user.email,
      phone: partner.phone
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPartner = null;
  }

  savePartner() {
    if (!this.selectedPartner || this.isSaving) return;

    this.isSaving = true;
    this.http.patch(`${this.apiUrl}/admin/partners/${this.selectedPartner.id}`, this.editFormData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Información del socio actualizada con éxito');
        this.closeEditModal();
        this.fetchApproved();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al actualizar el socio');
      }
    });
  }

  // Update Points
  openPointsModal(partner: any) {
    this.selectedPartner = partner;
    this.pointsFormData = {
      points: partner.points || 0,
      reason: ''
    };
    this.showPointsModal = true;
  }

  closePointsModal() {
    this.showPointsModal = false;
    this.selectedPartner = null;
  }

  savePoints() {
    if (!this.selectedPartner || this.isSavingPoints) return;

    this.isSavingPoints = true;
    this.http.patch(`${this.apiUrl}/admin/partners/${this.selectedPartner.id}/points`, this.pointsFormData).subscribe({
      next: () => {
        this.isSavingPoints = false;
        this.toastService.success('Puntos actualizados con éxito');
        this.closePointsModal();
        this.fetchApproved();
      },
      error: (err) => {
        this.isSavingPoints = false;
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al actualizar los puntos');
      }
    });
  }

  // Suspend/Activate Partner
  togglePartnerStatus(partner: any) {
    const newStatus = partner.status === 'APPROVED' ? 'REJECTED' : 'APPROVED';
    const action = newStatus === 'REJECTED' ? 'suspender' : 'activar';
    
    this.confirmationService.show({
      title: 'Confirmar Cambio de Estado',
      message: `¿Estás seguro de que deseas <strong>${action}</strong> a este socio?`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      confirmButtonClass: newStatus === 'REJECTED' ? 'warning' : 'primary'
    }).pipe(take(1)).subscribe((result: any) => {
      if (!result.confirmed) return;
      this.executeToggleStatus(partner, newStatus);
    });
  }

  private executeToggleStatus(partner: any, newStatus: string) {
    const action = newStatus === 'REJECTED' ? 'suspender' : 'activar';
    
    this.http.patch(`${this.apiUrl}/admin/partners/${partner.id}/status`, { status: newStatus }).subscribe({
      next: () => {
        this.toastService.success(`Socio ${action} con éxito`);
        this.fetchApproved();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al cambiar el estado del socio');
      }
    });
  }

  // View Details
  openDetailsModal(partner: any) {
    this.selectedPartner = partner;
    this.showDetailsModal = true;
    this.loadConsumptionHistory(partner.id);
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedPartner = null;
    this.consumptionHistory = [];
  }

  loadConsumptionHistory(partnerId: string) {
    this.http.get<any[]>(`${this.apiUrl}/admin/partners/${partnerId}/consumption-history`).subscribe({
      next: (history) => {
        this.consumptionHistory = history;
      },
      error: (err) => {
        console.error(err);
        this.consumptionHistory = [];
      }
    });
  }

  // Delete Partner
  openDeleteModal(partner: any) {
    this.selectedPartner = partner;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedPartner = null;
  }

  deletePartner() {
    if (!this.selectedPartner || this.isDeleting) return;

    this.confirmationService.show({
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar permanentemente al socio <strong>"${this.selectedPartner.user.name}"</strong>?<br><br>Esta acción eliminará:<br>• El perfil del socio<br>• La cuenta de usuario asociada<br>• Todos los registros relacionados<br><br><strong>Esta acción no se puede deshacer.</strong>`,
      confirmText: 'Eliminar Permanentemente',
      cancelText: 'Cancelar',
      confirmButtonClass: 'danger'
    }).pipe(take(1)).subscribe((result: any) => {
      if (!result.confirmed) return;
      this.executeDeletePartner();
    });
  }

  private executeDeletePartner() {
    if (!this.selectedPartner) return;

    this.isDeleting = true;
    this.http.delete(`${this.apiUrl}/admin/partners/${this.selectedPartner.id}`).subscribe({
      next: () => {
        this.isDeleting = false;
        this.toastService.success('Socio eliminado con éxito');
        this.closeDeleteModal();
        this.fetchApproved();
      },
      error: (err) => {
        this.isDeleting = false;
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al eliminar el socio');
      }
    });
  }
}
