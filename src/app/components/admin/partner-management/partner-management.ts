import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { SubscriptionService, SubscriptionPlan } from '../../../services/subscription.service';
import { SubscriberManagementService } from '../../../services/subscriber-management.service';

@Component({
  selector: 'app-partner-management',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './partner-management.html',
  styleUrl: './partner-management.scss'
})
export class PartnerManagement implements OnInit {
  pendingPartners = signal<any[]>([]);
  approvedPartners = signal<any[]>([]);
  loading = signal(true);
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
  
  constructor(
    private adminService: AdminService,
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
    this.adminService.getPendingPartners().subscribe({
      next: (res) => {
        this.pendingPartners.set(res || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  fetchApproved() {
    this.adminService.getAllPartners().subscribe({
      next: (res) => {
        this.approvedPartners.set((res || []).filter((p: any) => p.status === 'APPROVED'));
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

    if (confirm(`¿Estás seguro de que deseas ${status === 'APPROVED' ? 'aprobar' : 'rechazar'} a este socio?`)) {
      const payload: any = { status, referralPoints: 50 };
      if (planId) {
        payload.planId = planId;
      }

      this.adminService.validatePartner(id, payload).subscribe({
        next: () => {
          this.pendingPartners.update(partners => partners.filter(p => p.id !== id));
          this.toastService.success(`Socio ${status === 'APPROVED' ? 'aprobado' : 'rechazado'} con éxito.`);
          this.closeApprovalModal();
          this.fetchApproved();
        },
        error: () => {
          this.toastService.error('Error al procesar la solicitud.');
        }
      });
    }
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
    // Note: This endpoint might need to be added to AdminService
    this.adminService.post(`/admin/partners/${partnerId}/subscriptions`, {
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
      error: () => {
        this.isAssigningSubscription = false;
        this.toastService.error('Error al asignar suscripción');
      }
    });
  }

  getPartnerSubscriptions(partnerId: string) {
    return (this.subscriberService.subscribers?.() || []).filter((s: any) => s.partnerProfileId === partnerId);
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
    this.adminService.patch(`/admin/partners/${this.selectedPartner.id}`, this.editFormData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Información del socio actualizada con éxito');
        this.closeEditModal();
        this.fetchApproved();
      },
      error: () => {
        this.isSaving = false;
        this.toastService.error('Error al actualizar el socio');
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
    this.adminService.updatePartnerPoints(
      this.selectedPartner.id,
      this.pointsFormData.points,
      this.pointsFormData.reason || ''
    ).subscribe({
      next: () => {
        this.isSavingPoints = false;
        this.toastService.success('Puntos actualizados con éxito');
        this.closePointsModal();
        this.fetchApproved();
      },
      error: () => {
        this.isSavingPoints = false;
        this.toastService.error('Error al actualizar los puntos');
      }
    });
  }

  // Suspend/Activate Partner
  togglePartnerStatus(partner: any) {
    const newStatus = partner.status === 'APPROVED' ? 'REJECTED' : 'APPROVED';
    const action = newStatus === 'REJECTED' ? 'suspender' : 'activar';
    
    if (confirm(`¿Estás seguro de que deseas ${action} a este socio?`)) {
      this.adminService.patch(`/admin/partners/${partner.id}/status`, { status: newStatus }).subscribe({
        next: () => {
          this.toastService.success(`Socio ${action} con éxito`);
          this.fetchApproved();
        },
        error: () => {
          this.toastService.error('Error al cambiar el estado del socio');
        }
      });
    }
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
    this.adminService.getPartnerConsumption(partnerId).subscribe({
      next: (history) => {
        this.consumptionHistory = history || [];
      },
      error: () => {
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

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al socio "${this.selectedPartner.user.name}"?\n\nEsta acción eliminará:\n• El perfil del socio\n• La cuenta de usuario asociada\n• Todos los registros relacionados\n\nEsta acción no se puede deshacer.`)) {
      this.isDeleting = true;
      this.adminService.delete(`/admin/partners/${this.selectedPartner.id}`).subscribe({
        next: () => {
          this.isDeleting = false;
          this.toastService.success('Socio eliminado con éxito');
          this.closeDeleteModal();
          this.fetchApproved();
        },
        error: () => {
          this.isDeleting = false;
          this.toastService.error('Error al eliminar el socio');
        }
      });
    }
  }
}
