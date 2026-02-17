import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

interface GoogleMapsReview {
  id: string;
  authorName: string;
  authorUrl?: string;
  rating: number;
  text: string;
  time: number;
  profilePhotoUrl?: string;
  photoUrls?: string[];
}

@Component({
  selector: 'app-google-maps-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-maps-reviews.html',
  styleUrl: './google-maps-reviews.scss'
})
export class GoogleMapsReviews implements OnInit {
  reviews = signal<GoogleMapsReview[]>([]);
  loading = signal(true);

  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.loading.set(true);
    this.dataService.fetchGoogleMapsReviews().subscribe({
      next: (reviews) => {
        this.reviews.set(reviews || []);
        this.loading.set(false);
      },
      error: () => {
        this.reviews.set([]);
        this.loading.set(false);
      }
    });
  }

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  formatDate(timestamp: number | string | null | undefined): string {
    if (!timestamp) {
      return '';
    }
    
    // Handle BigInt or number conversion
    let timeValue: number;
    if (typeof timestamp === 'string') {
      timeValue = parseInt(timestamp, 10);
    } else if (typeof timestamp === 'bigint') {
      timeValue = Number(timestamp);
    } else {
      timeValue = timestamp;
    }
    
    // Google Maps timestamp is in seconds, convert to milliseconds
    const date = new Date(timeValue * 1000);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const lang = this.translationService.getCurrentLanguageValue();
    const localeMap: { [key: string]: string } = {
      'es': 'es-EC',
      'en': 'en-US',
      'fr': 'fr-FR'
    };
    
    try {
      return date.toLocaleDateString(localeMap[lang] || 'es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  }

  getGoogleMapsUrl(): string {
    const cafeInfo = this.dataService.cafeInfo();
    if (!cafeInfo || !cafeInfo.coordinates) return '';
    const { lat, lng } = cafeInfo.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
}
