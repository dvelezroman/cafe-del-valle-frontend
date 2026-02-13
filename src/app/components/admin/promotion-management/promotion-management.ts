import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-promotion-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion-management.html',
  styleUrl: './promotion-management.scss'
})
export class PromotionManagement implements OnInit {
  promotions = signal<any[]>([]);
  referralPoints = signal(50);
  loading = signal(true);
  showNewModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  isSaving = signal(false);
  isDeleting = signal(false);
  selectedPromotion = signal<any | null>(null);
  activeLang: 'es' | 'en' | 'fr' = 'es';
  
  formData: any = {
    name: { es: '', en: '', fr: '' },
    description: { es: '', en: '', fr: '' },
    pointsCost: 0,
    image: '',
    active: true
  };

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.adminService.getGlobalConfig().subscribe({
      next: (config: any) => {
        this.referralPoints.set(parseInt(config.POINTS_PER_REFERRAL || '50', 10));
      }
    });

    this.adminService.getPromotions().subscribe({
      next: (res) => {
        this.promotions.set(res || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  saveReferralPoints() {
    this.adminService.updateReferralPoints(this.referralPoints()).subscribe({
      next: () => {
        this.toastService.success('Configuración actualizada con éxito.');
      },
      error: () => {
        this.toastService.error('Error al actualizar la configuración.');
      }
    });
  }

  openCreateModal() {
    this.selectedPromotion.set(null);
    this.resetForm();
    this.showNewModal.set(true);
  }

  openEditModal(promotion: any) {
    this.selectedPromotion.set(promotion);
    this.formData = {
      name: {
        es: promotion.name?.es || '',
        en: promotion.name?.en || '',
        fr: promotion.name?.fr || ''
      },
      description: {
        es: promotion.description?.es || '',
        en: promotion.description?.en || '',
        fr: promotion.description?.fr || ''
      },
      pointsCost: promotion.pointsCost || 0,
      image: promotion.image || '',
      active: promotion.active !== undefined ? promotion.active : true
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedPromotion.set(null);
    this.resetForm();
  }

  closeNewModal() {
    this.showNewModal.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: { es: '', en: '', fr: '' },
      description: { es: '', en: '', fr: '' },
      pointsCost: 0,
      image: '',
      active: true
    };
    this.activeLang = 'es';
  }

  savePromotion() {
    if (this.isSaving()) return;

    if (!this.formData.name.es || !this.formData.description.es || !this.formData.pointsCost) {
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSaving.set(true);
    const promotionData = {
      ...this.formData,
      pointsCost: parseFloat(this.formData.pointsCost.toString())
    };

    if (this.selectedPromotion()) {
      this.adminService.updatePromotion(this.selectedPromotion()!.id, promotionData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Promoción actualizada con éxito');
          this.closeEditModal();
          this.fetchData();
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.error('Error al actualizar la promoción');
        }
      });
    } else {
      this.adminService.createPromotion(promotionData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Promoción creada con éxito');
          this.closeNewModal();
          this.fetchData();
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.error('Error al crear la promoción');
        }
      });
    }
  }

  openDeleteModal(promotion: any) {
    this.selectedPromotion.set(promotion);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedPromotion.set(null);
  }

  deletePromotion() {
    if (!this.selectedPromotion() || this.isDeleting()) return;

    if (confirm(`¿Estás seguro de que deseas eliminar la promoción "${this.selectedPromotion()!.name?.es || this.selectedPromotion()!.name?.en}"?`)) {
      this.isDeleting.set(true);
      this.adminService.deletePromotion(this.selectedPromotion()!.id).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.toastService.success('Promoción eliminada con éxito');
          this.closeDeleteModal();
          this.fetchData();
        },
        error: () => {
          this.isDeleting.set(false);
          this.toastService.error('Error al eliminar la promoción');
        }
      });
    }
  }

  toggleActive(promotion: any) {
    this.adminService.updatePromotion(promotion.id, {
      ...promotion,
      active: !promotion.active
    }).subscribe({
      next: () => {
        this.toastService.success(`Promoción ${!promotion.active ? 'activada' : 'desactivada'}`);
        this.fetchData();
      }
    });
  }

  Object = Object;
}
