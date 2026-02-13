import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  code?: { code: string };
  plan?: any;
  status: string;
  quotaRemaining?: number;
  notes?: string;
  usageEvents?: any[];
}

@Component({
    selector: 'app-quick-redemption',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './quick-redemption.html',
    styleUrl: './quick-redemption.scss'
})
export class QuickRedemptionComponent {
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);

    code = signal('');
    subscriber = signal<Subscriber | null>(null);
    loading = signal(false);
    redeeming = signal(false);
    error = signal('');

    @ViewChild('codeInput') codeInput!: ElementRef;

    searchByCode() {
        if (!this.code().trim()) return;

        this.loading.set(true);
        this.error.set('');
        this.subscriber.set(null);

        this.adminService.getSubscriberByCode(this.code().trim()).subscribe({
            next: (sub: any) => {
                this.subscriber.set(sub);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Código no encontrado o no asignado.');
                this.loading.set(false);
                this.toastService.error('Código no válido');
                setTimeout(() => this.codeInput.nativeElement.select(), 100);
            }
        });
    }

    redeemCoffee() {
        const sub = this.subscriber();
        if (!sub) return;

        if (sub.status !== 'ACTIVE') {
            this.toastService.error('Suscriptor no activo');
            return;
        }

        if (sub.quotaRemaining !== null && sub.quotaRemaining !== undefined && sub.quotaRemaining <= 0) {
            this.toastService.error('Sin cupo disponible');
            return;
        }

        this.redeeming.set(true);
        this.adminService.logUsage({
            subscriberId: sub.id,
            itemType: 'Coffee',
            quantity: 1,
            notes: 'Canje rápido'
        }).subscribe({
            next: () => {
                this.redeeming.set(false);
                this.toastService.success('¡Café canjeado correctamente!');
                this.searchByCode();
            },
            error: () => {
                this.redeeming.set(false);
                this.toastService.error('No se pudo procesar el canje');
            }
        });
    }

    clear() {
        this.code.set('');
        this.subscriber.set(null);
        this.error.set('');
        setTimeout(() => this.codeInput.nativeElement.focus(), 100);
    }
}
