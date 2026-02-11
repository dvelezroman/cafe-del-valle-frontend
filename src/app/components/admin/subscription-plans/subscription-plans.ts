import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, SubscriptionPlan } from '../../../services/subscription.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from '../../../services/confirmation.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-subscription-plans',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscription-plans.html',
    styleUrl: './subscription-plans.scss'
})
export class SubscriptionPlansComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);
    private confirmationService = inject(ConfirmationService);

    plans = this.subscriptionService.plans;
    isModalOpen = signal(false);
    editingPlan = signal<SubscriptionPlan | null>(null);
    isSaving = signal(false);

    // Form Model
    formData = signal({
        title: { es: '', en: '' },
        description: { es: '', en: '' },
        price: 0,
        features: { es: [], en: [] }, // handling as arrays might be complex in simple form, will use comma separated string for input
        featuresInputEs: '',
        featuresInputEn: '',
        active: true,
        order: 0,
        billingPeriod: 'MONTHLY' as 'MONTHLY' | 'YEARLY' | 'CUSTOM',
        billingDuration: null as number | null,
        billingDurationLabel: { es: '', en: '' }
    });

    ngOnInit() {
        this.subscriptionService.getAdminPlans().subscribe();
    }

    openModal(plan?: SubscriptionPlan) {
        if (plan) {
            this.editingPlan.set(plan);
            this.formData.set({
                title: { ...plan.title },
                description: { ...plan.description },
                price: plan.price,
                features: plan.features,
                featuresInputEs: Array.isArray(plan.features?.es) ? plan.features.es.join('\n') : plan.features?.es || '',
                featuresInputEn: Array.isArray(plan.features?.en) ? plan.features.en.join('\n') : plan.features?.en || '',
                active: plan.active,
                order: plan.order,
                billingPeriod: plan.billingPeriod || 'MONTHLY',
                billingDuration: plan.billingDuration || null,
                billingDurationLabel: plan.billingDurationLabel || { es: '', en: '' }
            });
        } else {
            this.editingPlan.set(null);
            this.resetForm();
        }
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    resetForm() {
        this.formData.set({
            title: { es: '', en: '' },
            description: { es: '', en: '' },
            price: 0,
            features: { es: [], en: [] },
            featuresInputEs: '',
            featuresInputEn: '',
            active: true,
            order: 0,
            billingPeriod: 'MONTHLY',
            billingDuration: null,
            billingDurationLabel: { es: '', en: '' }
        });
    }

    savePlan() {
        if (this.isSaving()) return;

        const data = this.formData();
        const payload: any = {
            title: data.title,
            description: data.description,
            price: data.price,
            features: {
                es: data.featuresInputEs.split('\n').filter(f => f.trim()),
                en: data.featuresInputEn.split('\n').filter(f => f.trim())
            },
            active: data.active,
            order: data.order,
            billingPeriod: data.billingPeriod
        };

        // Only include billingDuration and billingDurationLabel if period is CUSTOM
        if (data.billingPeriod === 'CUSTOM') {
            payload.billingDuration = data.billingDuration;
            payload.billingDurationLabel = data.billingDurationLabel;
        }

        this.isSaving.set(true);
        const operation = this.editingPlan() 
            ? this.subscriptionService.updatePlan(this.editingPlan()!.id, payload)
            : this.subscriptionService.createPlan(payload);

        operation.subscribe({
            next: () => {
                this.isSaving.set(false);
                this.closeModal();
            },
            error: () => {
                this.isSaving.set(false);
            }
        });
    }

    deletePlan(id: string) {
        this.confirmationService.show({
            title: 'Confirmar Eliminación',
            message: '¿Estás seguro de que deseas eliminar este plan de suscripción?<br><br><strong>Esta acción no se puede deshacer.</strong>',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            confirmButtonClass: 'danger'
        }).pipe(take(1)).subscribe((result: any) => {
            if (result.confirmed) {
                this.subscriptionService.deletePlan(id).subscribe();
            }
        });
    }
}
