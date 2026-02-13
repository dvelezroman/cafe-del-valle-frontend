import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cafe-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './cafe-info.html',
  styleUrl: './cafe-info.scss'
})
export class CafeInfo implements OnInit {
  loading = true;
  isSaving = false;
  activeLang: 'es' | 'en' | 'fr' = 'es';
  showMapPicker = false;
  info: any = {
    name: '',
    phone: '',
    email: '',
    address: '',
    latitude: 0,
    longitude: 0,
    tagline: { es: '', en: '', fr: '' },
    description: { es: '', en: '', fr: '' },
    hours: {}
  };

  // Default hours structure
  defaultHours: any = {
    'Lunes - Sábado': '9:00 AM - 11:00 PM',
    'Domingo': '4:00 PM - 9:00 PM'
  };

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadCafeInfo();
  }

  loadCafeInfo() {
    this.loading = true;
    this.adminService.getCafeInfo().subscribe({
      next: (data: any) => {
        if (data) {
          this.info = {
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            tagline: data.tagline || { es: '', en: '', fr: '' },
            description: data.description || { es: '', en: '', fr: '' },
            hours: data.hours || this.defaultHours
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cafe info:', err);
        this.loading = false;
      }
    });
  }

  save() {
    if (this.isSaving) return;

    // Validation
    if (!this.info.name?.trim()) {
      this.toastService.error('El nombre del café es requerido');
      return;
    }

    const updateData = {
      name: this.info.name.trim(),
      phone: this.info.phone?.trim() || '',
      email: this.info.email?.trim() || '',
      address: this.info.address?.trim() || '',
      latitude: parseFloat(this.info.latitude) || 0,
      longitude: parseFloat(this.info.longitude) || 0,
      tagline: this.info.tagline,
      description: this.info.description,
      hours: this.info.hours
    };

    this.isSaving = true;
    this.adminService.updateCafeInfo(updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Información guardada correctamente');
        this.loadCafeInfo();
        this.announceToScreenReader('Información guardada correctamente');
      },
      error: () => {
        this.isSaving = false;
        this.announceToScreenReader('Error al guardar la información');
      }
    });
  }

  updateCoordinates(lat: number, lng: number) {
    this.info.latitude = lat;
    this.info.longitude = lng;
    this.showMapPicker = false;
  }

  addHourDay() {
    const day = prompt('Nombre del día o rango (ej: Lunes - Viernes):');
    if (day && day.trim()) {
      this.info.hours[day.trim()] = '9:00 AM - 6:00 PM';
    }
  }

  removeHourDay(key: string) {
    if (confirm(`¿Eliminar horario para "${key}"?`)) {
      delete this.info.hours[key];
      // Create new object to trigger change detection
      this.info.hours = { ...this.info.hours };
    }
  }

  // Helper to access Object.keys in template
  Object = Object;

  private announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}
