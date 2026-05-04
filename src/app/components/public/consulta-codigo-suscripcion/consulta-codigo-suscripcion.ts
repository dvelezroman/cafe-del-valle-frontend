import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicPortalService } from '../../../services/public-portal.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-consulta-codigo-suscripcion',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './consulta-codigo-suscripcion.html',
    styleUrl: './consulta-codigo-suscripcion.scss',
})
export class ConsultaCodigoSuscripcionComponent {
    private portal = inject(PublicPortalService);
    private toast = inject(ToastService);
    private translationService = inject(TranslationService);

    code = '';
    loading = signal(false);
    result = signal<any | null>(null);

    consultar() {
        const v = this.code.trim();
        if (!v) {
            this.toast.error('Ingresa tu código de socio');
            return;
        }
        this.loading.set(true);
        this.result.set(null);
        this.portal.lookupSubscriberByCode(v).subscribe({
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

    statusLabel(status: string): string {
        const map: Record<string, string> = {
            ACTIVE: 'Activa',
            PENDING: 'Pendiente',
            SUSPENDED: 'Suspendida',
            EXPIRED: 'Vencida',
            CANCELLED: 'Cancelada',
        };
        return map[status] || status;
    }

    translate(key: string, params?: { [key: string]: string }): string {
        return this.translationService.translate(key, params);
    }
}
