import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-points-purchase',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './points-purchase.html',
    styleUrl: './points-purchase.scss',
})
export class PointsPurchaseComponent {
    private admin = inject(AdminService);
    private toast = inject(ToastService);

    idNumber = '';
    pointsEarned: number | null = null;
    productName = '';
    notes = '';
    submitting = signal(false);
    lastResult = signal<any | null>(null);

    submit() {
        const pts = Number(this.pointsEarned);
        if (!this.idNumber.trim()) {
            this.toast.error('Ingresa la cédula');
            return;
        }
        if (!Number.isFinite(pts) || pts < 0) {
            this.toast.error('Puntos inválidos');
            return;
        }
        this.submitting.set(true);
        this.lastResult.set(null);
        this.admin
            .creditPointsByDocument({
                idNumber: this.idNumber.trim(),
                pointsEarned: pts,
                productName: this.productName || undefined,
                notes: this.notes || undefined,
            })
            .subscribe({
                next: (res) => {
                    this.submitting.set(false);
                    this.lastResult.set(res);
                    this.toast.success(
                        res.destination === 'PARTNER'
                            ? 'Puntos acreditados al perfil del socio'
                            : 'Puntos acreditados a cuenta pública (sin perfil de socio)',
                    );
                    this.pointsEarned = null;
                },
                error: () => this.submitting.set(false),
            });
    }
}
