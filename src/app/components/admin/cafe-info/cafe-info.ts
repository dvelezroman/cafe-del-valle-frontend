import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data';
import { ToastService } from '../../../services/toast.service';
import { HttpClient } from '@angular/common/http';

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
  info: any = {
    name: '',
    phone: '',
    address: '',
    latitude: 0,
    longitude: 0,
    tagline: { es: '', en: '', fr: '' },
    description: { es: '', en: '', fr: '' }
  };

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Fetch fresh data from API
    this.dataService.fetchCafeInfo().subscribe({
      next: (data) => {
        if (data) {
          this.info = {
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            latitude: data.coordinates?.lat || 0,
            longitude: data.coordinates?.lng || 0,
            tagline: data.tagline || { es: '', en: '', fr: '' },
            description: data.description || { es: '', en: '', fr: '' }
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cafe info:', err);
        this.loading = false;
        this.toastService.error('Error al cargar la información del café');
      }
    });
  }

  save() {
    if (this.isSaving) return;

    const updateData = {
      name: this.info.name,
      phone: this.info.phone,
      address: this.info.address,
      latitude: this.info.latitude,
      longitude: this.info.longitude,
      tagline: this.info.tagline,
      description: this.info.description
    };

    this.isSaving = true;
    this.http.put('http://localhost:3000/api/cafe/info', updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Información guardada correctamente');
        // Refresh data
        this.dataService.fetchCafeInfo().subscribe();
        // Announce success to screen readers
        this.announceToScreenReader('Información guardada correctamente');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving cafe info:', err);
        this.toastService.error('Error al guardar la información');
        this.announceToScreenReader('Error al guardar la información');
      }
    });
  }

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
