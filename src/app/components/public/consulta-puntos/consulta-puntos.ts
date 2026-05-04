import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicPortalService } from '../../../services/public-portal.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-consulta-puntos',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './consulta-puntos.html',
    styleUrl: './consulta-puntos.scss',
})
export class ConsultaPuntosComponent {
    private portal = inject(PublicPortalService);
    private toast = inject(ToastService);
    private translationService = inject(TranslationService);

    idNumber = '';
    loading = signal(false);
    result = signal<any | null>(null);

    consultar() {
        const v = this.idNumber.trim();
        if (!v) {
            this.toast.error('Ingresa tu número de identificación');
            return;
        }
        this.loading.set(true);
        this.result.set(null);
        this.portal.lookupLoyalty({ idNumber: v }).subscribe({
            next: (res) => {
                this.loading.set(false);
                this.result.set(res);
            },
            error: () => {
                this.loading.set(false);
                this.toast.error('No se pudo consultar. Intenta de nuevo.');
            },
        });
    }

    translate(key: string, params?: { [key: string]: string }): string {
        return this.translationService.translate(key, params);
    }
}
