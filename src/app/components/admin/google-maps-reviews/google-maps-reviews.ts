import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface GoogleMapsReview {
  id: string;
  placeId: string;
  authorName: string;
  authorUrl?: string;
  rating: number;
  text: string;
  time: number;
  profilePhotoUrl?: string;
  photoUrls?: string[];
  language?: string;
  syncAt: string;
}

interface SyncStats {
  totalReviews: number;
  lastSyncAt: string | null;
}

@Component({
  selector: 'app-google-maps-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './google-maps-reviews.html',
  styleUrl: './google-maps-reviews.scss'
})
export class GoogleMapsReviewsComponent implements OnInit {
  reviews = signal<GoogleMapsReview[]>([]);
  stats = signal<SyncStats | null>(null);
  config = signal<any>(null);
  loading = signal(false);
  syncing = signal(false);
  savingConfig = signal(false);
  
  placeId = signal('');
  apiKeyConfigured = signal(false);
  canAutoDetect = signal(false);

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadConfig();
    this.loadStats();
    this.loadReviews();
  }

  loadConfig() {
    this.loading.set(true);
    this.adminService.getGoogleMapsConfig().subscribe({
      next: (config) => {
        this.config.set(config);
        this.placeId.set(config.placeId || '');
        this.apiKeyConfigured.set(config.apiKeyConfigured || false);
        this.canAutoDetect.set(config.canAutoDetect || false);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar la configuración');
      }
    });
  }

  loadStats() {
    this.adminService.getGoogleMapsStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: () => {
        // Silently fail, stats are not critical
      }
    });
  }

  loadReviews() {
    this.adminService.getGoogleMapsReviews(20).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews || []);
      },
      error: () => {
        this.reviews.set([]);
      }
    });
  }

  syncReviews() {
    if (this.syncing()) return;

    const placeId = this.placeId() || undefined;
    
    if (!placeId && !this.canAutoDetect()) {
      this.toastService.error('Por favor configura el Place ID de Google Maps primero');
      return;
    }

    this.syncing.set(true);
    this.adminService.syncGoogleMapsReviews(placeId, false).subscribe({
      next: (result) => {
        this.syncing.set(false);
        this.toastService.success(result.message || 'Sincronización completada');
        this.loadStats();
        this.loadReviews();
      },
      error: (err) => {
        this.syncing.set(false);
        const message = err.error?.message || 'Error al sincronizar reseñas';
        this.toastService.error(message);
      }
    });
  }

  saveConfig() {
    if (this.savingConfig()) return;

    this.savingConfig.set(true);
    this.adminService.updateGoogleMapsConfig({ placeId: this.placeId() || undefined }).subscribe({
      next: () => {
        this.savingConfig.set(false);
        this.toastService.success('Configuración guardada correctamente');
        this.loadConfig();
      },
      error: () => {
        this.savingConfig.set(false);
        this.toastService.error('Error al guardar la configuración');
      }
    });
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatReviewDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
