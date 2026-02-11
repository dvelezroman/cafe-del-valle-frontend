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
  showEditModal = false;
  showDeleteModal = false;
  isSaving = false;
  isDeleting = false;
  selectedPromotion: any = null;
  editFormData: any = {
    name: { es: '', en: '', fr: '' },
    description: { es: '', en: '', fr: '' },
    pointsCost: 0,
    image: '',
    active: true
  };

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

  openEditModal(promotion: any) {
    this.selectedPromotion = promotion;
    this.editFormData = {
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
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPromotion = null;
    this.resetEditForm();
  }

  resetEditForm() {
    this.editFormData = {
      name: { es: '', en: '', fr: '' },
      description: { es: '', en: '', fr: '' },
      pointsCost: 0,
      image: '',
      active: true
    };
  }

  savePromotion() {
    if (!this.selectedPromotion || this.isSaving) {
      if (!this.selectedPromotion) {
        this.toastService.error('No hay promoción seleccionada');
      }
      return;
    }

    if (!this.editFormData.name.es || !this.editFormData.description.es || !this.editFormData.pointsCost) {
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSaving = true;
    this.http.put(`${this.adminApi}/promotions/${this.selectedPromotion.id}`, this.editFormData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Promoción actualizada con éxito');
        this.closeEditModal();
        this.fetchData();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.toastService.error('Error al actualizar la promoción');
      }
    });
  }

  openDeleteModal(promotion: any) {
    this.selectedPromotion = promotion;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedPromotion = null;
  }

  deletePromotion() {
    if (!this.selectedPromotion || this.isDeleting) {
      if (!this.selectedPromotion) {
        this.toastService.error('No hay promoción seleccionada');
      }
      return;
    }

    this.isDeleting = true;
    this.http.delete(`${this.adminApi}/promotions/${this.selectedPromotion.id}`).subscribe({
      next: () => {
        this.isDeleting = false;
        this.toastService.success('Promoción eliminada con éxito');
        this.closeDeleteModal();
        this.fetchData();
      },
      error: (err) => {
        this.isDeleting = false;
        console.error(err);
        this.toastService.error('Error al eliminar la promoción');
      }
    });
  }
}
