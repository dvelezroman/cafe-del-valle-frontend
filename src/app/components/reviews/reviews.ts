import { Component, computed } from '@angular/core';
import { DataService } from '../../services/data';
import { Review } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss'
})
export class Reviews {
  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) { }

  reviews = computed(() => this.dataService.reviews());

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const lang = this.translationService.getCurrentLanguageValue();
    const localeMap: { [key: string]: string } = {
      'es': 'es-EC',
      'en': 'en-US',
      'fr': 'fr-FR'
    };
    return date.toLocaleDateString(localeMap[lang] || 'es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
