import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  constructor(public dataService: DataService) {}
  
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
  
  getMapEmbedUrl(): string {
    const { lat, lng } = this.cafeInfo.coordinates;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902b8d14f473a4c5%3A0xb96edf09ab4c809f!2zQ2Fmw6kgZGVsIFZhbGxl!5e0!3m2!1ses!2sec!4v1234567890123!5m2!1ses!2sec`;
  }
}
