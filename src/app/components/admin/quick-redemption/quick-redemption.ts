import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriberManagementService, Subscriber } from '../../../services/subscriber-management.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-quick-redemption',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './quick-redemption.html',
    styleUrl: './quick-redemption.scss'
})
export class QuickRedemptionComponent {
    private subscriberService = inject(SubscriberManagementService);
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

        this.subscriberService.getSubscriberByCode(this.code().trim()).subscribe({
            next: (sub) => {
                this.subscriber.set(sub);
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.error.set('Código no encontrado o no asignado.');
                this.loading.set(false);
                this.toastService.show('Código no válido', 'error');
                // Refocus input for quick retry
                setTimeout(() => this.codeInput.nativeElement.select(), 100);
            }
        });
    }

    redeemCoffee() {
        const sub = this.subscriber();
        if (!sub) return;

        if (sub.status !== 'ACTIVE') {
            this.toastService.show('Suscriptor no activo', 'error');
            return;
        }

        if (sub.quotaRemaining !== null && sub.quotaRemaining <= 0) {
            this.toastService.show('Sin cupo disponible', 'error');
            return;
        }

        this.redeeming.set(true);
        this.subscriberService.logUsage({
            subscriberId: sub.id,
            itemType: 'Coffee',
            quantity: 1,
            notes: 'Quick Redemption Widget'
        }).subscribe({
            next: () => {
                this.redeeming.set(false);
                this.toastService.show('¡Café canjeado correctamente!', 'success');

                // Refresh data to show updated quota
                this.searchByCode();
            },
            error: (err) => {
                console.error(err);
                this.redeeming.set(false);
                this.toastService.show('No se pudo procesar el canje', 'error');
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
