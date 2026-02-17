import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataService } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  cafeInfo = computed(() => this.dataService.cafeInfo());

  mapEmbedUrl = computed(() => {
    const info = this.cafeInfo();
    if (!info || !info.coordinates || !info.coordinates.lat || !info.coordinates.lng) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    const { lat, lng } = info.coordinates;
    // Google Maps Embed URL using coordinates (works without API key)
    // Format: https://www.google.com/maps?q=lat,lng&output=embed
    // This uses the standard Google Maps iframe embed format
    const unsafeUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed&hl=es`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  });

  constructor(
    public dataService: DataService,
    private sanitizer: DomSanitizer,
    public translationService: TranslationService
  ) { }

  getGoogleMapsUrl(): string {
    const info = this.cafeInfo();
    if (!info) return '';
    const { lat, lng } = info.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  getPhoneUrl(): string {
    const info = this.cafeInfo();
    return info ? `tel:${info.phone.replace(/\s/g, '')}` : '';
  }

  getHoursArray(): Array<{ key: string, value: string }> {
    const info = this.cafeInfo();
    if (!info || !info.hours) return [];
    return Object.entries(info.hours).map(([key, value]) => ({ key, value: String(value) }));
  }

  translateDayName(dayKey: string): string {
    // Map Spanish day names to translation keys
    const dayMap: { [key: string]: string } = {
      'Lunes - Sábado': 'days.monday.saturday',
      'Lunes - Viernes': 'days.monday.friday',
      'Lunes': 'days.monday',
      'Martes': 'days.tuesday',
      'Miércoles': 'days.wednesday',
      'Jueves': 'days.thursday',
      'Viernes': 'days.friday',
      'Sábado': 'days.saturday',
      'Domingo': 'days.sunday'
    };

    const translationKey = dayMap[dayKey];
    if (translationKey) {
      return this.translate(translationKey);
    }

    // If no translation found, try to translate individual words
    if (dayKey.includes(' - ')) {
      const parts = dayKey.split(' - ');
      const translatedParts = parts.map(part => {
        const partKey = dayMap[part.trim()];
        return partKey ? this.translate(partKey) : part;
      });
      return translatedParts.join(' - ');
    }

    return dayKey;
  }

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }
}
