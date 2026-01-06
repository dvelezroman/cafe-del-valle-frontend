import { Component } from '@angular/core';
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
  mapEmbedUrl: SafeResourceUrl;
  
  constructor(
    public dataService: DataService,
    private sanitizer: DomSanitizer,
    public translationService: TranslationService
  ) {
    const { lat, lng } = this.cafeInfo.coordinates;
    // URL del mapa embed con las coordenadas reales del local
    const unsafeUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902bed59bb5eff65%3A0xaa6b6e74c4c70ce7!2sAtanacio%20Santos%20%26%20Calle%20Augusto%20Moreira%2C%20Portoviejo!5e0!3m2!1ses!2sec!4v1234567890123!5m2!1ses!2sec`;
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
  
  get cafeInfo() {
    return this.dataService.getCafeInfo();
  }
  
  getGoogleMapsUrl(): string {
    const { lat, lng } = this.cafeInfo.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  
  getPhoneUrl(): string {
    return `tel:${this.cafeInfo.phone.replace(/\s/g, '')}`;
  }
  
  getHoursArray(): Array<{key: string, value: string}> {
    if (!this.cafeInfo.hours) return [];
    return Object.entries(this.cafeInfo.hours).map(([key, value]) => ({ key, value }));
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
