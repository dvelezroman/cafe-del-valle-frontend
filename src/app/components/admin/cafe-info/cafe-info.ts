import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cafe-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './cafe-info.html',
  styleUrl: './cafe-info.scss'
})
export class CafeInfo implements OnInit {
  loading = true;
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
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // In a real app, fetch from backend. For now simulation.
    setTimeout(() => {
      this.info = { ...this.dataService.getCafeInfo() };
      this.loading = false;
    }, 500);
  }

  save() {
    this.toastService.success('Información guardada correctamente (Simulado)');
    console.log('Saving info:', this.info);
  }
}
